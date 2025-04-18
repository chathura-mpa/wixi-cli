# 🚀 Wixi CLI

A lightweight Node.js CLI to scaffold projects using a template structure.

## Features

- 🧠 Smart template binding with folder exclusions
- 🔧 Simple `bind` command: `wixi bind`
- ⚙️ Built-in support for custom extensions

## Getting Started

```bash
# Clone this repo
git clone https://github.com/yourusername/wixi-cli.git
cd wixi-cli

# Install dependencies
npm install

# Run it
npx ts-node src/index.ts bind
```

### Or link globally
```bash
npm run build
npm link

wixi bind
```

## Commands

| Command       | Description                     |
|---------------|---------------------------------|
| `wixi bind`   | Copies template files into your project |

## License

MIT
