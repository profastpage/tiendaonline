# 🤖 Integración con IA - Guía para Desarrolladores

El sistema está preparado para integrar IA (Qwen) para procesamiento de pedidos por voz y texto.

## Modelos Preparados

El modelo `IaAudit` en la base de datos está listo para auditar interacciones con IA:

```prisma
model IaAudit {
  id          String   @id @default(uuid())
  tenantId    String
  tipo        String   // "voz_a_texto", "interpretacion_pedido", etc.
  input       String   // Entrada raw (audio transcrito, texto, etc.)
  output      String   // Resultado procesado
  metadata    Json?    // Datos adicionales
  createdAt   DateTime @default(now())
}
```

## Casos de Uso Futuros

### 1. Procesamiento de Audio de WhatsApp

```typescript
// apps/backend/src/modules/ia/ia.service.ts

@Injectable()
export class IaService {
  async procesarAudioDeWhatsApp(
    tenantId: string,
    audioBuffer: Buffer,
  ): Promise<string> {
    // 1. Transcribir audio a texto
    const transcripcion = await this.qwen.audioToText(audioBuffer);
    
    // 2. Interpretar el pedido
    const pedido = await this.interpretarPedido(transcripcion, tenantId);
    
    // 3. Auditar
    await this.prisma.iaAudit.create({
      data: {
        tenantId,
        tipo: 'voz_a_texto',
        input: transcripcion,
        output: JSON.stringify(pedido),
        metadata: {
          duracionAudio: audioBuffer.length,
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    return pedido;
  }
}
```

### 2. Interpretación de Pedido por Texto

```typescript
async interpretarPedido(
  texto: string,
  tenantId: string,
): Promise<CreatePedidoDto> {
  // Prompt para Qwen
  const prompt = `
    Eres un asistente que interpreta pedidos de tienda online.
    
    Texto del cliente: "${texto}"
    
    Extrae:
    1. Nombre del cliente
    2. Teléfono
    3. Productos mencionados (nombre, cantidad, variante si aplica)
    4. Notas adicionales
    
    Responde en formato JSON.
  `;
  
  const response = await this.qwen.chat(prompt);
  return JSON.parse(response);
}
```

### 3. Chatbot Automático

```typescript
@Injectable()
export class ChatbotService {
  async responderConsulta(
    tenantId: string,
    mensaje: string,
    contexto?: any,
  ): Promise<string> {
    // Obtener información del tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { productos: true },
    });
    
    // Prompt enriquecido con contexto
    const prompt = `
      Eres el asistente virtual de ${tenant.nombre}.
      
      Información de la tienda:
      - WhatsApp: ${tenant.whatsappNumero}
      - Dirección: ${tenant.direccion}
      - Productos disponibles: ${tenant.productos.length}
      
      Mensaje del cliente: "${mensaje}"
      
      Responde de forma amable y útil. Si te preguntan por productos,
      menciona los disponibles. Si te preguntan por envíos, usa la
      dirección de la tienda.
    `;
    
    return this.qwen.chat(prompt);
  }
}
```

## Endpoints Sugeridos

### POST /ia/procesar-audio
```typescript
@Post('procesar-audio')
async procesarAudio(
  @CurrentTenant() tenant: any,
  @Body() audioData: { audio: string }, // Base64
) {
  const audioBuffer = Buffer.from(audioData.audio, 'base64');
  const resultado = await this.iaService.procesarAudioDeWhatsApp(
    tenant.id,
    audioBuffer,
  );
  return { texto: resultado };
}
```

### POST /ia/interpretar-texto
```typescript
@Post('interpretar-texto')
async interpretarTexto(
  @CurrentTenant() tenant: any,
  @Body() body: { texto: string },
) {
  const pedido = await this.iaService.interpretarPedido(
    body.texto,
    tenant.id,
  );
  return { pedido };
}
```

### POST /ia/chat
```typescript
@Post('chat')
async chat(
  @CurrentTenant() tenant: any,
  @Body() body: { mensaje: string; contexto?: any },
) {
  const respuesta = await this.chatbotService.responderConsulta(
    tenant.id,
    body.mensaje,
    body.contexto,
  );
  return { respuesta };
}
```

## Integración con WhatsApp Business API

```typescript
// Cuando llega un mensaje de WhatsApp
@Post('whatsapp/webhook')
async whatsappWebhook(@Body() webhookData: any) {
  const { from, message } = webhookData;
  
  // Si es audio
  if (message.type === 'audio') {
    const audioBuffer = await this.downloadAudio(message.audio.id);
    const texto = await this.iaService.procesarAudioDeWhatsApp(
      webhookData.tenantId,
      audioBuffer,
    );
    // Crear pedido con el texto transcrito
  }
  
  // Si es texto
  if (message.type === 'text') {
    const pedido = await this.iaService.interpretarPedido(
      message.text.body,
      webhookData.tenantId,
    );
    // Crear pedido automáticamente
  }
  
  // Responder automáticamente
  const respuesta = await this.chatbotService.responderConsulta(
    webhookData.tenantId,
    message.text?.body || '[Audio transcrito]',
  );
  await this.enviarWhatsApp(from, respuesta);
}
```

## Configuración Requerida

### Variables de Entorno
```env
# IA / Qwen
QWEN_API_KEY=tu_api_key
QWEN_MODEL=qwen-max
QWEN_BASE_URL=https://dashscope.aliyuncs.com/api/v1

# WhatsApp Business API (opcional)
WHATSAPP_BUSINESS_TOKEN=token
WHATSAPP_BUSINESS_PHONE_ID=phone_id
```

### Dependencias Adicionales
```bash
npm install axios form-data
```

## Ejemplo de Flujo Completo

1. **Cliente envía audio por WhatsApp:**
   ```
   [Audio: "Hola, quiero 2 poleras negras talla M y 1 jean talla 32"]
   ```

2. **Sistema procesa:**
   ```typescript
   audio → transcripción → interpretación → pedido
   ```

3. **Pedido creado automáticamente:**
   ```json
   {
     "clienteTelefono": "+51999999999",
     "items": [
       {
         "productoId": "polera-negra",
         "varianteId": "talla-m",
         "cantidad": 2
       },
       {
         "productoId": "jean-slim",
         "varianteId": "talla-32",
         "cantidad": 1
       }
     ]
   }
   ```

4. **Respuesta automática:**
   ```
   "¡Gracias por tu pedido! Hemos recibido:
   - 2x Polera Negra Talla M
   - 1x Jean Slim Talla 32
   Total: S/ 329.70
   
   Tu número de pedido es: PED-0002"
   ```

## Próximos Pasos

1. **Obtener API Key de Qwen**
   - Registrarse en DashScope
   - Crear API Key

2. **Implementar servicio de IA**
   - Crear `IaModule`
   - Implementar `IaService`
   - Crear endpoints

3. **Integrar con WhatsApp**
   - Configurar WhatsApp Business API
   - Implementar webhooks
   - Testing con números reales

4. **Testing y mejora**
   - Probar con audios reales
   - Ajustar prompts
   - Mejorar precisión

---

**La base está lista. Solo falta integrar el proveedor de IA!** 🚀
