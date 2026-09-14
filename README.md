# LuminaArt - Photo Studio & Digital Image Processing Suite 🎨✨

**LuminaArt** is a full-featured Picsart-inspired web application featuring real-time client-side **Digital Image Processing (DIP)** algorithms, a versatile **Collage Studio**, an interactive **24-Hour Ephemeral Community Feed**, and comprehensive **Dark/Light Mode** support.

---

## 🌟 Key Features

### 1. 🖼️ Photo Editing & Digital Image Processing (DIP)
All image operations run purely client-side on raw `ImageData` pixel buffers via HTML5 Canvas for zero latency, 100% privacy, and instant previewing.

- **Edge Detection Operators**:
  - **Sobel Operator**:
    $$G_x = \begin{bmatrix} -1 & 0 & 1 \\ -2 & 0 & 2 \\ -1 & 0 & 1 \end{bmatrix}, \quad G_y = \begin{bmatrix} -1 & -2 & -1 \\ 0 & 0 & 0 \\ 1 & 2 & 1 \end{bmatrix}, \quad |G| = \sqrt{G_x^2 + G_y^2}$$
    Supports horizontal-only, vertical-only, and combined directional modes with threshold cutoff.
  - **Roberts Cross Operator**:
    $$G_x = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}, \quad G_y = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$
  - **Prewitt Operator**: 3×3 spatial gradient convolution.
  - **Laplacian Operator**: 2nd-order derivative zero-crossing edge detector (4-connectivity & 8-connectivity).
- **Histogram Equalization (HE)**:
  - Computes 256-bin Probability Mass Function (PMF) and Cumulative Distribution Function (CDF):
    $$s_k = \text{round}\left((L-1) \cdot \frac{\text{CDF}(k) - \text{CDF}_{\min}}{(M \times N) - \text{CDF}_{\min}}\right)$$
  - Equalizes in **HSL / Luminance space** to enhance dynamic range without inducing color tint shifts.
  - **Live 256-Bin Interactive Histogram Canvas** for RGB and Luminance channels.
  - **DIP Mathematical Inspector Modal**: Full formula derivations and kernel explanations for educational and research inspection.
- **Grayscale Conversions & Binarization**:
  - ITU-R BT.601 ($Y = 0.299R + 0.587G + 0.114B$)
  - ITU-R BT.709 ($Y = 0.2126R + 0.7152G + 0.0722B$)
  - Average and Desaturation.
  - **Otsu's Optimal Automatic Thresholding**: Inter-class variance maximization $\max_t [\sigma_B^2(t)]$.
- **Clarity, Sharpening & Deblurring**:
  - **High-Boost Sharpening**: Laplacian convolution matrix.
  - **Unblur / Deblur**: High-frequency deconvolution:
    $$I_{\text{restored}} = I + \lambda \cdot (I - G_{\text{blur}} * I)$$
  - **Separable 1D Gaussian Blur**: $O(K \times N)$ execution for smooth performance.
- **Color & Tone Adjustments**:
  - Brightness, Contrast, Saturation, Exposure, Warmth/Temperature, Highlights, and Shadows.
- **Transform & Geometry**:
  - Interactive Crop overlay with aspect presets (Free, 1:1, 4:3, 16:9, 9:16 Story, 3:2 Photo).
  - 90° Rotate Clockwise / Counter-Clockwise, fine angle slider (-180° to +180°), Flip H, Flip V.
- **AI & Background Remover**:
  - Magic Wand color-similarity keying with tolerance and feathering.
  - Background modes: **Transparent PNG**, **Solid Color**, **Gradient**, **Custom Image Upload**, and **Portrait Blur** (bokeh).
- **Bicubic Super-Resolution Upscaling**:
  - 2× and 4× upscaling via Catmull-Rom bicubic spline convolution with edge sharpening.
- **Multi-Format Compression & Export**:
  - Export to **JPG, JPEG, PNG, WEBP, and PDF** (via `jspdf`).
  - Quality parameter slider with **real-time estimated file size calculation**.
- **Before/After Comparison**:
  - Interactive split slider comparing original vs edited image in real time.

---

### 2. 🧩 Collage Maker Studio
- **10 Layout Templates**: 2 to 9 photos, plus Polaroid style with white borders and rotation tilts.
- **Customization Controls**: Inner spacing gap, corner rounding radius, outer border padding, and background color picker.
- **One-Click Auto-Fill**: Populate slots with sample photos instantly.
- **Seamless Transfer**: Directly **"Open in Photo Editor"** to apply DIP filters to collages, or **"Export as JPG/PDF"**.

---

### 3. ⏱️ 24-Hour Ephemeral Community Feed
- **24-Hour Strict Expiration Lifecycle**:
  - Posts store `createdAt` and `expiresAt = createdAt + 24 * 60 * 60 * 1000`.
  - Live ticking countdown timer: `⏳ 18h 42m remaining` (color-coded urgency indicator).
  - Real-time progress bar showing elapsed fraction of the 24-hour window.
  - Automatic cleanup engine removing expired posts periodically.
- **Public vs. Private Visibility**:
  - **Public**: Shared with the community.
  - **Private**: Visible only to creator under "My Creations".
- **Social Features**:
  - Heart likes with animated counter.
  - Interactive comments drawer.
  - Share options: Web Share API, Copy Link, Direct Image Download.
  - Filter tabs: "Public Feed", "My Creations", "Expiring Soon (<4h)", and instant search.

---

### 4. 🌓 Light & Dark Mode
- Full theme toggle persisted in `localStorage`.
- Canvas workspace features a custom checkered transparency background tailored for both light and dark themes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/Saichaithanya0609/photo_studio_app.git
cd photo_studio_app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
```

---

## 🛠️ Built With
- **React 19** & **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** (Icons)
- **jsPDF** (High-Resolution PDF Generation)
- **canvas-confetti** (Celebratory publishing animations)
- **HTML5 2D Canvas & TypedArrays** (Raw pixel image processing)
