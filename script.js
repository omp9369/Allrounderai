const GOOGLE_API_KEY = "AIzaSyCiN7NYm14wDT3Dc0vbl41YWhEoWwi9Wm0";

const promptEl = document.getElementById("prompt");
const outEl    = document.getElementById("output");
const dlLink   = document.getElementById("downloadLink");

// 1️⃣ TEXT → IMAGE (Google Imagen via Vertex AI)
async function genImage(){
  const prompt = promptEl.value.trim();
  if(!prompt){ alert("Prompt चाहिए!"); return; }

  outEl.innerHTML = "⏳ Generating image…";
  dlLink.style.display = "none";

  try{
    const url = "https://us-central1-aiplatform.googleapis.com/v1"
              + `/projects/gen-lang-client-0810632205/locations/us-central1`
              + `/publishers/google/models/imagen-4-ultra-generate:predict`
              + `?key=${GOOGLE_API_KEY}`;

    const res = await fetch(url,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        instances:[{prompt}],
        parameters:{sampleCount:1,imageSize:"512"}
      })
    });

    const data = await res.json();
    const b64  = data.predictions[0].bytesBase64Encoded;
    const blob = await (await fetch(`data:image/png;base64,${b64}`)).blob();
    const obj  = URL.createObjectURL(blob);

    outEl.innerHTML = `<img src="${obj}" alt="AI Image">`;
    dlLink.href = obj; dlLink.download = "image.png"; dlLink.style.display = "inline-block";
  }catch(err){
    outEl.innerText = "❌ Google Image error: " + err;
  }
}

// 2️⃣ TEXT → SPEECH (Google Cloud TTS)
async function genSpeech(){
  const prompt = promptEl.value.trim();
  if(!prompt){ alert("Text चाहिए!"); return; }

  outEl.innerHTML = "⏳ Generating speech…";
  dlLink.style.display = "none";

  try{
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          input:{text:prompt},
          voice:{languageCode:"hi-IN", name:"hi-IN-Standard-A"},
          audioConfig:{audioEncoding:"MP3"}
        })
      });

    const {audioContent} = await res.json();
    const blob = await (await fetch(`data:audio/mp3;base64,${audioContent}`)).blob();
    const obj  = URL.createObjectURL(blob);

    outEl.innerHTML = `<audio controls src="${obj}"></audio>`;
    dlLink.href = obj; dlLink.download = "speech.mp3"; dlLink.style.display = "inline-block";
  }catch(err){
    outEl.innerText = "❌ Google TTS error: " + err;
  }
}

// 3️⃣ TEXT → VIDEO (Google Veo via Vertex AI – if available)
async function genVideo(){
  const prompt = promptEl.value.trim();
  if(!prompt){ alert("Prompt चाहिए!"); return; }

  outEl.innerHTML = "⏳ Generating video…";
  dlLink.style.display = "none";

  try{
    const url = "https://us-central1-aiplatform.googleapis.com/v1"
              + `/projects/gen-lang-client-0810632205/locations/us-central1`
              + `/publishers/google/models/veo-3-generate-preview:predict`
              + `?key=${GOOGLE_API_KEY}`;

    const res = await fetch(url,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        instances:[{prompt}],
        parameters:{sampleCount:1,framesPerSecond:24,durationSeconds:4}
      })
    });

    const data = await res.json();
    const b64  = data.predictions[0].bytesBase64Encoded;
    const blob = await (await fetch(`data:video/mp4;base64,${b64}`)).blob();
    const obj  = URL.createObjectURL(blob);

    outEl.innerHTML = `<video controls src="${obj}" loop></video>`;
    dlLink.href = obj; dlLink.download = "video.mp4"; dlLink.style.display = "inline-block";
  }catch(err){
    outEl.innerText = "❌ Google Video error: " + err;
  }
          }
