# Proyecto Base: Pruebas End to End con Kraken

## ¿Qué es Kraken-Node?

Kraken es un framework moderno y fácil de usar para realizar pruebas E2E (End-to-End). Ofrece una interfaz intuitiva y herramientas integradas para depuración, lo que lo hace ideal para pruebas en aplicaciones web modernas. Este repositorio cuenta con la configuración base de Kraken para la automatización de pruebas E2E.

[Kraken-Node](https://www.npmjs.com/package/kraken-node) es una herramienta diseñada para facilitar la creación y ejecución de pruebas E2E. Utiliza una arquitectura basada en escenarios definidos en Gherkin y ejecutados con Cucumber.js. Esto permite a los equipos de desarrollo y pruebas trabajar de manera colaborativa en la definición de casos de prueba.

### Características principales:

- **Soporte para múltiples navegadores**: Ejecuta pruebas en Chrome, Firefox, y más.
- **Modo headless**: Ideal para integraciones en pipelines de CI/CD.
- **Integración con Gherkin**: Define escenarios de prueba en un lenguaje legible por humanos.
- **Depuración sencilla**: Herramientas integradas para identificar y resolver problemas rápidamente.

### Configuración adicional

1. **Definir escenarios de prueba**: Los escenarios deben ser escritos en el directorio `features` utilizando el formato Gherkin.
2. **Actualizar credenciales**: Modifica el archivo `properties.json` con las credenciales específicas de tu aplicación.

Este proyecto está diseñado para estudiantes de maestría que buscan aprender y aplicar pruebas automatizadas en proyectos reales. ¡Explora, experimenta y automatiza con Kraken!

## Requisitos Básicos

- **Node.js** (versión 22 o superior). Recomendamos utilizar la versión `lts/jod`.
- **npm** para la gestión de dependencias.
- **ADB** (Android Debug Bridge): requerido solo si se desea ejecutar pruebas móviles; configurar `mobile.json` con la ruta y paquete del APK.

## Instalación

Desde la **raíz del repositorio**:

```bash
npm run kraken:install
```

O bien, desde el directorio del módulo:

```bash
npm install
```

## Ejecución de Pruebas

Desde la **raíz del repositorio**:

```bash
npm run kraken:test
```

O bien, desde el directorio del módulo:

```bash
npm test
```

> **Nota:** Kraken no dispone de modo de interfaz gráfica interactiva; `kraken:ui` ejecuta las mismas pruebas en modo headless.

## Configuración

El archivo `package.json` incluye la configuración básica para ejecutar pruebas con Kraken:

```json
"scripts": {
    "prepare": "",
    "test": "npx kraken-node run",
    "test:ui": "npx kraken-node run"
},
"dependencies": {
    "@cucumber/cucumber": "7.2.1",
    "chai": "^5.2.0",
    "kraken-node": "^1.0.24"
}
```

El archivo `properties.json` contiene las credenciales necesarias para las pruebas. Actualiza sus valores con los datos correctos de tu entorno:

```json
{
  "FIRSTNAME": "Monitor",
  "LASTNAME": "Pruebas",
  "USERNAME": "pruebas",
  "PASSWORD": "MISO4208"
}
```

El archivo `mobile.json` es un template para pruebas móviles. Sus campos `<APK_PATH>`, `<APK_PACKAGE>` y `<APK_LAUNCH_ACTIVITY>` son marcadores de posición que debes reemplazar con los valores de tu aplicación antes de ejecutar pruebas en Android.
