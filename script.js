// 🛡️  OpenAI & HuggingFace keys –––>  अपनी key यहाँ डालें
const OPENAI_KEY = "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";
const HF_KEY     = "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";

// UI helpers
const promptEl = document.getElementById("prompt");
const outEl    = document.getElementById("output");
const dlLink   = document.getElementById("downloadLink");

// ------- 1. Text → IMAGE (OpenAI DALL·E) ----------
async function genImage(){
  const prompt = promptEl.value.trim();
  if(!prompt){alert("Prompt चाहिए!");return;}

  outEl.innerHTML = "⏳ Generating image…";
  dlLink.style.display="none";

  try{
    const res = await fetch("https://api.openai.com/v1/images/generations",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${OPENAI_KEY}`
      },
      body:JSON.stringify({
        model:"dall-e-3",
        prompt,
        n:1,
        size:"512x512"
      })
    });
    const data = await res.json();
    const url  = data.data[0].url;
    outEl.innerHTML = `<img src="${url}" alt="AI Image">`;
    dlLink.href=url; dlLink.download="image.png"; dlLink.style.display="inline-block";
  }catch(e){
    outEl.innerText="❌ Error: "+e;
  }
}

// ------- 2. Text → SPEECH (OpenAI TTS) ------------
async function genSpeech(){
  const prompt = promptEl.value.trim();
  if(!prompt){alert("Text चाहिए!");return;}

  outEl.innerHTML="⏳ Generating speech…";
  dlLink.style.display="none";

  try{
    const res = await fetch("https://api.openai.com/v1/audio/speech",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${OPENAI_KEY}`
      },
      body:JSON.stringify({
        model:"tts-1",
        input:prompt,
        voice:"nova"
      })
    });
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    outEl.innerHTML = `<audio controls src="${url}"></audio>`;
    dlLink.href=url; dlLink.download="speech.mp3"; dlLink.style.display="inline-block";
  }catch(e){
    outEl.innerText="❌ Speech error: "+e;
  }
}

// ------- 3. Text → VIDEO (placeholder / HF demo) ---
async function genVideo(){
  const prompt = promptEl.value.trim();
  if(!prompt){alert("Prompt चाहिए!");return;}

  outEl.innerHTML="⏳ Generating video (slow)…";
  dlLink.style.display="none";

  try{
    const res = await fetch("https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${HF_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({inputs:prompt})
    });
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    outEl.innerHTML=`<video controls src="${url}" loop></video>`;
    dlLink.href=url; dlLink.download="video.mp4"; dlLink.style.display="inline-block";
  }catch(e){
    outEl.innerText="❌ Video error (model busy/slow): "+e;
  }
}