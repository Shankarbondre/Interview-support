let recognition=null, listening=false;
const $=id=>document.getElementById(id);
const status=t=>$("status").textContent=t;

function setupSpeech(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){status("Speech recognition is not supported in this browser.");return false}
  recognition=new SR(); recognition.lang="en-US"; recognition.continuous=true; recognition.interimResults=true;
  recognition.onresult=e=>{
    let text="";
    for(let i=e.resultIndex;i<e.results.length;i++) text+=e.results[i][0].transcript+" ";
    $("question").value=text.trim();
  };
  recognition.onerror=e=>status("Speech error: "+e.error);
  recognition.onend=()=>{if(listening){try{recognition.start()}catch(_){}}};
  return true;
}
$("audio").onclick=()=>{
  if(!recognition&&!setupSpeech()) return;
  if(!listening){
    listening=true; $("audio").textContent="⏹ Stop Audio"; $("audio").className="danger"; status("Listening...");
    recognition.start();
  }else{
    listening=false; recognition.stop(); $("audio").textContent="🎙 Start Audio"; $("audio").className="";
    status("Stopped — generating answer..."); generate();
  }
};

async function generate(){
  const q=$("question").value.trim(); if(!q){status("No question detected.");return}
  const endpoint=localStorage.getItem("ia_endpoint")||"";
  if(!endpoint){
    $("answer").textContent="Configure your secure AI backend endpoint in Settings.\n\nDetected question:\n"+q+"\n\nExpected response: 4–6 short interview-ready bullet points.";
    status("Answer ready (backend not configured)"); return;
  }
  status("Generating...");
  try{
    const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      question:q,
      instruction:"Answer as an experienced senior interview candidate. Give 4–6 short bullet points, simple confident English, practical experience, and bold important keywords."
    })});
    if(!r.ok) throw new Error("HTTP "+r.status);
    const data=await r.json();
    $("answer").textContent=data.answer||data.output||JSON.stringify(data);
    status("Answer ready");
  }catch(e){$("answer").textContent="Backend error: "+e.message;status("Generation failed")}
}
$("generate").onclick=generate;
$("copy").onclick=async()=>{await navigator.clipboard.writeText($("answer").textContent);status("Answer copied")};
$("clear").onclick=()=>{$("question").value="";$("answer").textContent="Answer will appear here.";status("Ready")};
$("save").onclick=()=>{localStorage.setItem("ia_endpoint",$("endpoint").value.trim());status("Endpoint saved")};
$("endpoint").value=localStorage.getItem("ia_endpoint")||"";
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
