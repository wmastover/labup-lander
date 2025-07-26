# Lab Up Landing Page

An interactive React landing page for Lab Up featuring:

- **White screen with static logo** (Lab Up Logo.png)
- **Click-triggered animation** (Lab Up Logo Animation.gif)
- **Fade to black transition**
- **Dynamic background reveal** with burst of color effect
- **Modern UI with glass-morphism content overlay**
- **Responsive design** for all screen sizes

## Features

### Interactive Animation Sequence
1. **Initial State**: Clean white background with static Lab Up logo
2. **Click Interaction**: Logo transforms into animated GIF
3. **Transition**: Smooth fade to black
4. **Reveal**: Burst of color as cosmic background appears
5. **Content**: Title, subtitle, and call-to-action button with modern styling

### Technical Implementation
- **React 18** with hooks (useState for state management)
- **CSS3 animations** with keyframes and transitions
- **Responsive design** with mobile breakpoints
- **Modern styling** with gradients, backdrop filters, and smooth animations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development
The app will be available at `http://localhost:3000`

## Deployment Options

Since GitHub is experiencing issues with the large image files, here are alternative deployment methods:

### Option 1: Netlify Drop
1. Run `npm run build`
2. Go to [netlify.com/drop](https://netlify.com/drop)
3. Drag and drop the `build` folder
4. Get instant deployment URL

### Option 2: Vercel
1. Run `npm run build`
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel --prod` and follow prompts
4. Connect to GitHub later when file size issues are resolved

### Option 3: Local Server
```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build

# Access at http://localhost:3000
```

## File Structure
```
├── public/
│   ├── index.html
│   ├── Lab Up Logo.png          # Static logo (614KB)
│   └── Lab Up Logo Animation.gif # Animated logo (2.7MB)
├── src/
│   ├── App.js                   # Main React component
│   ├── App.css                  # Styling and animations
│   ├── index.js                 # React entry point
│   ├── index.css                # Global styles
│   └── background.png           # Background image (2.7MB)
└── package.json
```

## Customization

### Timing Adjustments
In `src/App.js`, modify these values:
- **Animation duration**: Change `3000` in setTimeout (line 15)
- **Fade duration**: Change `1000` in setTimeout (line 18)

### Styling
In `src/App.css`:
- **Colors**: Modify gradient colors in `.cta-button`
- **Sizes**: Adjust `.logo` max-width/height
- **Animations**: Modify keyframe values

### Content
In `src/App.js`:
- **Main title**: Change "Welcome to Lab Up"
- **Subtitle**: Change "Elevating Innovation Through Experimentation"
- **CTA text**: Change "Get Started"

## Known Issues
- Large file sizes preventing GitHub push (working on optimization)
- Consider image compression for better performance

## Future Enhancements
- [ ] Optimize image file sizes
- [ ] Add loading states
- [ ] Implement actual CTA functionality
- [ ] Add sound effects
- [ ] Mobile-specific animations

---

**Built with ❤️ for Lab Up** 