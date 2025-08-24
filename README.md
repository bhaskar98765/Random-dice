# 🎲 Random Dice Magic App (PWA)

यह एक magician के लिए बनाया गया **Random Dice App** है, जो stage पर magic trick करने के लिए perfect है।  
इस app में audience को dice बिल्कुल real और random दिखता है, लेकिन magician secretly **apna chosen number force कर सकता है**।  

---

## ✨ Features
- **Black Screen + Realistic Dice** → screen पर सिर्फ dice, background पूरा black।
- **Dice Size** → thumb-size (ना बहुत बड़ा, ना बहुत छोटा)।
- **Random Rolls** → swipe या tap करने पर हर बार अलग number आता है।
- **Secret Setup Mode** → 
  - Stage से पहले screen पर **5 बार tap** करो → hidden panel खुलेगा।
  - 1–6 में से कोई number चुनो → वह save हो जाएगा (localStorage में)।
- **Force Mode (Stage पर)** → 
  - कहीं भी **3 सेकंड long-press** करो।
  - Corner में छोटा white dot दिखेगा (सिर्फ magician को पता चलेगा)।
  - अगली roll पर वही fixed number आएगा, फिर dice normal हो जाएगा।
- **Offline Support (PWA)** → 
  - App **Add to Home Screen** किया जा सकता है।
  - Offline में भी पूरी तरह काम करेगा।
  - Full-screen खुलेगा (कोई URL bar नहीं)।

---

## 📂 Files Included
- `index.html` → Dice UI और main structure
- `app.js` → Logic (random roll, secret setup, long press, fixed number control)
- `manifest.json` → PWA setup (app name, icons, fullscreen mode)
- `sw.js` → Service Worker (offline caching)
- `icon-192.png`, `icon-512.png` → App icons (dice design)

---

## 🚀 How to Run
1. Folder download करो और unzip/extract कर लो।
2. Browser में `index.html` file open करो।
3. Phone में Chrome/Edge/Safari से **Add to Home Screen** करो।
4. App अब **full-screen** और offline काम करेगा।

---

## 🎩 How to Perform the Trick
1. **Before show:**  
   - App खोलो।  
   - Screen पर **5 बार tap** करो → Secret Setup menu आएगा।  
   - वही number चुनो जो आपने audience को paper पर लिखवाया है।  
   - अब ये number secretly save हो गया है।  

2. **On stage (audience के सामने):**  
   - Audience को app दिखाओ और dice roll करो → हर बार random numbers दिखेंगे।  
   - अब phone audience को दो और बोलो roll करो।  
   - जब आपको force करना हो, **screen पर 3 sec long-press** करो।  
   - Corner में छोटा सा white dot दिखेगा (indicator कि force mode active है)।  
   - अब अगली roll में वही fixed number आएगा → जो paper पर लिखा था।  
   - इसके बाद dice फिर से random हो जाएगा।  

---

## ⚙️ Customization
- Dice का size बदलने के लिए `index.html` में CSS variable `--size` edit करो।  
  Example:  
  ```css
  :root {
    --size: min(20vmin, 150px);
  }
