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

- **Node.js** (versión 20 o superior). Recomendamos utilizar la versión `lts/iron`.
- **npm** o **yarn** para la gestión de dependencias.

## Instalación

Instala las dependencias necesarias utilizando npm:

```bash
npm install
```

## Ejecución de Pruebas

Puedes ejecutar las pruebas en modo headless utilizando el siguiente comando:

```bash
npm test
```

## Configuración

El archivo `package.json` incluye la configuración básica para ejecutar pruebas con Kraken. A continuación, se detalla su contenido relevante:

```json
"scripts": {
    "prepare": "",
    "test": "npx kraken-node run",
    "test:ui": "npx kraken-node run"
},
"dependencies": {
    "chai": "^5.2.0",
    "kraken-node": "^1.0.24"
}
```

Además, el archivo `properties.json` contiene las credenciales necesarias para las pruebas automatizadas. Este archivo debe ser configurado con los valores adecuados para tu entorno:

```json
{
  "FIRSTNAME": "Monitor",
  "LASTNAME": "Pruebas",
  "USERNAME": "pruebas",
  "PASSWORD": "MISO4208"
}
```
