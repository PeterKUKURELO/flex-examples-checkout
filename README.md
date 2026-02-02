# EJEMPLO - Demos Pay-me (VPOS2 Modal + VPOS Flex)

Este ejemplo contiene dos demos de integracion para Pay-me:
- VPOS 2 Modal: flujo con modal embebido usando el SDK de VPOS2.
- VPOS Flex: formulario flexible con carga de SDK y flujo normal, popup o expandido.

## Archivos principales
- `BaseGeneral.html`: pagina base con tarjetas para abrir los demos y modal de VPOS2.
- `BaseGeneral.js`: logica del modal VPOS2, manejo de ambiente y payload.
- `EjemploGeneral.html`: demo completo de VPOS Flex con UI, perfiles y callbacks.

## Assets
Imagenes locales usadas por las pantallas y metodos de pago:
`amex.png`, `cuotealo.png`, `dinners.png`, `ds.png`, `Fondooooo.png`,
`fotoFlex.png`, `fotoModal.png`, `mstc.png`, `pagoefectivo.png`,
`Pay-MeLogo.png`, `Pay-MeLOOGOO.png`, `PayMeBanner.png`, `qr.png`,
`visa.png`, `yape.png`.

## Como usar
1) Abre `BaseGeneral.html` en el navegador.
2) En la tarjeta "VPOS 2 - Modal", haz clic para abrir el modal y enviar el form.
3) En la tarjeta "VPOS Flex - Flexible", se abre `EjemploGeneral.html` en otra pestaña.

## Demo VPOS 2 (BaseGeneral.html + BaseGeneral.js)
- Selector de ambiente: TEST/PROD.
- El ambiente se mantiene en la URL con `?env=test` o `?env=prod`.
- El submit arma el payload y llama a `AlignetVPOS2.openModal(...)`.
- El hash `purchaseVerification` se genera con SHA-512 en el browser.

Notas:
- Si usas `file://`, algunos navegadores bloquean `crypto.subtle`. Sirve mejor desde un server local.
- El SDK de VPOS2 se carga desde dominios externos segun el ambiente.

## Demo VPOS Flex (EjemploGeneral.html)
Incluye:
- Panel de credenciales (Client ID, Client Secret, Merchant Code).
- Selector de entorno (Testing/Produccion) con URLs separadas para token/nonce y SDK Flex.
- Metodos de pago configurables (CARD, YAPE, QR, CUOTEALO, PAGOEFECTIVO).
- Tres flujos: formulario normal, popup y expandido.
- Pantalla de respuesta y utilidades para ver JSON request/response y descargar notas.

Persistencia local:
- Perfiles guardados en IndexedDB (`payme_demo_db` / store `profiles`).
- Entorno guardado en `localStorage` (clave `payme_env`).

Auto-start:
- Se puede iniciar automaticamente en carga con:
  - `AUTO_START_ON_LOAD`
  - `AUTO_START_FLOW` (normal | popup | expandido)
  - `AUTO_START_MINOR_UNITS`

## Ajustes rapidos
- Credenciales y endpoints estan en `EjemploGeneral.html` (constantes `DEFAULT_CREDS` y `ENVS`).
- Configuracion VPOS2 por ambiente en `BaseGeneral.js` (`CONFIG_BY_ENV`).
- Monto/moneda se toman del panel antes de enviar el formulario.

## Requisitos
- Conexion a internet para cargar SDKs externos y estilos.
- Navegador moderno (para `fetch` y `crypto.subtle`).
