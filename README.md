# @contentstorage/react

[![npm version](https://img.shields.io/npm/v/@contentstorage/react.svg)](https://www.npmjs.com/package/@contentstorage/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React hooks and components for [@contentstorage/core](https://github.com/kaidohussar/contentstorage-core) - A key-value based CMS library with TypeScript support.

## Features

- **React Hooks** - Access content through intuitive React hooks
- **Type-Safe Components** - Fully typed React components with TypeScript support
- **ContentProvider Context** - Centralized content and language management
- **Multi-Language Support** - Built-in internationalization with language switching
- **Headless & Static Modes** - Fetch from Contentstorage API or use static JSON
- **Loading States** - Built-in loading and error state management
- **Live Editor Support** - Auto-reload content changes in development
- **Zero Config** - Works out of the box with sensible defaults

## Installation

```bash
npm install @contentstorage/react
```

or

```bash
yarn add @contentstorage/react
```

## Quick Start

### 1. Set up your content

First, configure and pull content using the [@contentstorage/core](https://github.com/kaidohussar/contentstorage-core) CLI:

```bash
# Pull content from ContentStorage
npx contentstorage pull --key YOUR_CONTENT_KEY

# Generate TypeScript types
npx contentstorage generate-types
```

### 2. Wrap your app with ContentProvider

```tsx
import { ContentProvider } from '@contentstorage/react';

function App() {
  return (
    <ContentProvider
      contentMode="headless"
      contentKey="YOUR_CONTENT_KEY"
      languageCodes={['EN', 'ET', 'FI']}
      loadingFallback={<div>Loading content...</div>}
      onError={(error) => console.error('Content error:', error)}
    >
      <YourApp />
    </ContentProvider>
  );
}
```

### 3. Use content in your components

```tsx
import { Text, useGetText, useManageLanguage } from '@contentstorage/react';

function Welcome() {
  const greeting = useGetText({ contentId: 'home.greeting' });
  const { currentLanguageCode, setLanguage } = useManageLanguage();

  return (
    <div>
      <h1>{greeting}</h1>

      {/* Or use the component */}
      <Text contentId="home.description" />

      <button onClick={() => setLanguage('ET')}>
        Switch to Estonian
      </button>
    </div>
  );
}
```

## API Reference

### ContentProvider

The main provider component that manages content state and language switching.

#### Headless Mode (Fetch from API)

```tsx
<ContentProvider
  contentMode="headless"
  contentKey="YOUR_CONTENT_KEY"
  languageCodes={['EN', 'ET', 'FI']}
  withPendingChanges={false}  // Optional: include unpublished changes. Use true only in development mode
  loadingFallback={<Spinner />}  // Optional: loading UI
  onError={(error) => handleError(error)}  // Optional: error handler
>
  {children}
</ContentProvider>
```

#### Static Mode (Use Local JSON)

```tsx
import enContent from './content/en.json';
import etContent from './content/et.json';

<ContentProvider
  contentMode="static"
  staticContent={{
    EN: enContent,
    ET: etContent,
  }}
  languageCodes={['EN', 'ET']}
>
  {children}
</ContentProvider>
```

### Hooks

#### useGetText

Get text content with type safety and optional variable substitution.

```tsx
import { useGetText } from '@contentstorage/react';

function MyComponent() {
  const title = useGetText({ contentId: 'home.title' });

  // With variables
  const greeting = useGetText({
    contentId: 'home.welcome',
    variables: { name: 'John' }
  });

  return <h1>{title}</h1>;
}
```

#### useGetImage

Get image content with URL and alt text.

```tsx
import { useGetImage } from '@contentstorage/react';

function MyComponent() {
  const { url, altText } = useGetImage({ contentId: 'home.hero' });

  return <img src={url} alt={altText} />;
}
```

#### useGetVariation

Get variation content (e.g., A/B test variants).

```tsx
import { useGetVariation } from '@contentstorage/react';

function MyComponent() {
  const content = useGetVariation({
    contentId: 'home.cta',
    variationId: 'variant-a'
  });

  return <div>{content}</div>;
}
```

#### useManageLanguage

Manage current language and switch between languages.

```tsx
import { useManageLanguage } from '@contentstorage/react';

function LanguageSwitcher() {
  const {
    currentLanguageCode,
    languageCodes,
    setLanguage
  } = useManageLanguage();

  return (
    <select
      value={currentLanguageCode}
      onChange={(e) => setLanguage(e.target.value)}
    >
      {languageCodes.map(lang => (
        <option key={lang} value={lang}>{lang}</option>
      ))}
    </select>
  );
}
```

#### useIsFetchingContent

Get the current loading status of content.

```tsx
import { useIsFetchingContent } from '@contentstorage/react';

function MyComponent() {
  const { status } = useIsFetchingContent();
  // status can be: 'idle' | 'loading' | 'failed'

  if (status === 'loading') {
    return <Spinner />;
  }

  return <Content />;
}
```

#### useContent

Access the full content context (used internally by other hooks).

```tsx
import { useContent } from '@contentstorage/react';

function MyComponent() {
  const {
    languageCodes,
    status,
    currentLanguageCode,
    setLanguage
  } = useContent();

  return <div>Current language: {currentLanguageCode}</div>;
}
```

### Components

#### Text

Render text content as a string.

```tsx
import { Text } from '@contentstorage/react';

function MyComponent() {
  return (
    <div>
      <Text contentId="home.title" />

      {/* With variables */}
      <Text
        contentId="home.greeting"
        variables={{ name: 'John' }}
      />
    </div>
  );
}
```

#### Image

Render an image with automatic URL and alt text.

```tsx
import { Image } from '@contentstorage/react';

function MyComponent() {
  return (
    <Image
      contentId="home.hero"
      className="hero-image"
      style={{ maxWidth: '100%' }}
    />
  );
}
```

#### Variation

Render variation content.

```tsx
import { Variation } from '@contentstorage/react';

function MyComponent() {
  return (
    <Variation
      contentId="home.cta"
      variationId="variant-a"
    />
  );
}
```

## TypeScript Integration

When you use the `contentstorage generate-types` command from [@contentstorage/core](https://github.com/kaidohussar/contentstorage-core), type definitions are automatically generated. This enables full autocomplete and type checking:

```tsx
// TypeScript will autocomplete content IDs and validate they exist
const title = useGetText({ contentId: 'home.title' }); // ✅ Valid
const invalid = useGetText({ contentId: 'invalid.key' }); // ❌ TypeScript error

// Variable types are also checked
const greeting = useGetText({
  contentId: 'home.welcome',
  variables: { name: 'John' } // ✅ TypeScript knows 'name' is required
});
```

## Content Structure

Content is organized in a hierarchical key-value structure and accessed using dot notation:

```json
{
  "home": {
    "title": "Welcome",
    "greeting": "Hello, {{name}}!",
    "hero": {
      "url": "https://example.com/image.jpg",
      "altText": "Hero image"
    }
  }
}
```

Access in your components:

```tsx
<Text contentId="home.title" />
<Text contentId="home.greeting" variables={{ name: 'User' }} />
<Image contentId="home.hero" />
```

## Package.json Scripts

Add these convenient scripts to your `package.json`:

```json
{
  "scripts": {
    "content:pull": "contentstorage pull --key YOUR_CONTENT_KEY",
    "content:types": "contentstorage generate-types",
    "content:sync": "npm run content:pull && npm run content:types"
  }
}
```

Then run:

```bash
npm run content:sync
```

## Live Editor Mode

Enable automatic content reloading during development by including pending changes:

```tsx
<ContentProvider
  contentMode="headless"
  contentKey="YOUR_CONTENT_KEY"
  languageCodes={['en', 'et']}
  withPendingChanges={process.env.NODE_ENV === 'development'}
>
  {children}
</ContentProvider>
```

This allows content editors to see changes in real-time without rebuilding your app.

## Integration with @contentstorage/core

This package is a React wrapper around [@contentstorage/core](https://github.com/kaidohussar/contentstorage-core). You can also use core functions directly:

```tsx
import { getText, getImage, fetchContent } from '@contentstorage/core';

// Direct API calls
const content = getText('home.title');
const image = getImage('home.hero');

// Programmatic content fetching
await fetchContent('ET', { contentKey: 'YOUR_KEY' });
```

See the [core package documentation](https://github.com/kaidohussar/contentstorage-core) for more details on CLI commands, configuration, and API methods.

## Requirements

- React >= 16.8.0
- React DOM >= 16.8.0
- @contentstorage/core >= 1.2.0
- TypeScript >= 5.0.0 (for type generation)
- Node.js >= 18.0.0

## License

MIT

## Author

Kaido Hussar

## Links

- [GitHub Repository](https://github.com/kaidohussar/contentstorage-react)
- [Core Package](https://github.com/kaidohussar/contentstorage-core)
- [NPM Package](https://www.npmjs.com/package/@contentstorage/react)
- [Report Issues](https://github.com/kaidohussar/contentstorage-react/issues)

## Support

For questions, issues, or feature requests, please [open an issue](https://github.com/kaidohussar/contentstorage-react/issues) on GitHub.