<div align="center">

# PickIt — Open-Source Decision Wheel

A clean, minimal, single-viewport decision wheel web application. Enter options, spin the wheel, or drag it freely to let fate decide.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Yaseen549/pickit/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Yaseen549/pickit?style=social)](https://github.com/Yaseen549/pickit)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)

**[Live Repository: https://github.com/Yaseen549/pickit](https://github.com/Yaseen549/pickit)**

</div>

---

## ✨ Features

- **Single-Viewport Experience**: Fits seamlessly in a single desktop or mobile viewport with zero page scrolling.
- **Interactive Mouse & Touch Rotation**: Click and drag the wheel freely to place it anywhere, or trigger a spin.
- **Cryptographic Randomness**: Driven by `crypto.getRandomValues()` with accurate deceleration physics and 12 o'clock pointer alignment.
- **Curated Presets**: Quick-start templates for food choices, movie nights, study planning, team tasks, and more.
- **Local Storage Collections**: Save, rename, and load your custom decision lists privately in your browser.
- **Elimination Mode**: One-click removal of the selected winner for multi-round tournaments.
- **100% Client-Side & Private**: No accounts, no analytics, no external databases.

---

## 🚀 Quick Start (Run Standalone)

Clone and run the application locally:

```bash
# Clone the repository
git clone https://github.com/Yaseen549/pickit.git

# Enter the project directory
cd pickit

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port assigned by your terminal) in your browser.

---

## 📦 How to Use PickIt in Your Own Repository / Project

If you want to integrate the decision wheel into an existing React or Next.js codebase, you can easily extract the core wheel module:

### Step 1: Copy Core Files into Your Project

Copy these self-contained files from `pickit`:

```text
your-project/
├── hooks/
│   └── useWheel.js           # Physics, deceleration, drag, and winner detection engine
├── utils/
│   ├── wheelMath.js          # Angular geometry, normalization, and crypto RNG
│   └── wheelColors.js        # Harmonious segment palette generator
└── components/
    ├── WheelCanvas.jsx       # High-DPI Canvas wheel renderer with mouse & touch drag
    └── DecisionWheel.jsx     # Wheel stage with controls and winner status
```

### Step 2: Install Required Icons (Optional)

```bash
npm install lucide-react canvas-confetti
```

### Step 3: Embed the Wheel Component

```jsx
import { useWheel } from "@/hooks/useWheel";
import WheelCanvas from "@/components/WheelCanvas";

export default function MyCustomPicker() {
  const options = ["Pizza", "Burgers", "Tacos", "Sushi", "Salad", "Pasta"];

  const {
    rotationAngle,
    pointerKick,
    isSpinning,
    isDragging,
    winner,
    spin,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useWheel({
    options,
    onSpinComplete: (result) => {
      console.log("Winner is:", result.winner.text);
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <WheelCanvas
        options={options}
        rotationAngle={rotationAngle}
        pointerKick={pointerKick}
        isSpinning={isSpinning}
        isDragging={isDragging}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />

      <button
        onClick={spin}
        disabled={isSpinning || isDragging}
        className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold cursor-pointer"
      >
        {isSpinning ? "Spinning..." : "Spin Wheel"}
      </button>

      {winner && (
        <p className="text-sm font-semibold">Selected: {winner.text}</p>
      )}
    </div>
  );
}
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Spin the wheel / Spin again |
| <kbd>Enter</kbd> | Add new option to list |
| <kbd>Esc</kbd> | Close any open modal dialog |

---

## 🧪 Testing

PickIt includes automated tests covering angle normalization, cryptographic distribution, pointer alignment, boundary safety, and elimination logic:

```bash
npm test
```

---

## 🌟 Support & Contributing

Contributions, bug reports, and feature suggestions are welcome!

1. Fork the repository: [https://github.com/Yaseen549/pickit](https://github.com/Yaseen549/pickit)
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

⭐ **If you find PickIt helpful, please consider starring the repository on [GitHub](https://github.com/Yaseen549/pickit)!**

---

## 📄 License

Distributed under the open-source [MIT License](LICENSE).
