async function loadData(){
  const res=await fetch("data.json");
  if(!res.ok) throw new Error("Could not load data.json");
  return res.json();
}

function escapeHtml(v){
  return String(v).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function makeProject(project){
  const card=document.createElement("article");
  card.className="project-card";
  const safeUrl=escapeHtml(project.video);
  card.innerHTML=`
    <div class="video-wrap">
      <iframe
        src="${safeUrl}"
        title="${escapeHtml(project.title)}"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen></iframe>
    </div>
    <div class="project-body">
      <h3 class="project-title">${escapeHtml(project.title)}</h3>
      <p class="project-meta">${escapeHtml(project.meta)}</p>
      <a class="project-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
        Open ${escapeHtml(project.platform || "video")} ↗
      </a>
    </div>`;
  return card;
}

function makeService(service,index){
  const card=document.createElement("article");
  card.className="service";
  card.innerHTML=`
    <div class="service-number">0${index+1}</div>
    <h3>${escapeHtml(service.title)}</h3>
    <p>${escapeHtml(service.description)}</p>`;
  return card;
}

loadData().then(data=>{
  document.title=`${data.name} — ${data.headline}`;
  document.getElementById("brand").textContent=data.name;
  document.getElementById("footer-name").textContent=data.name;
  document.getElementById("location").textContent=data.location;
  document.getElementById("headline").innerHTML=data.headline.replace(" & ","<br>& ");
  document.getElementById("description").innerHTML=data.description;
  document.getElementById("year").textContent=new Date().getFullYear();

  const projects=document.getElementById("projects");
  data.projects.forEach(p=>projects.appendChild(makeProject(p)));

  const bio=document.getElementById("bio");
  data.bio.forEach(t=>{
    const p=document.createElement("p");
    p.innerHTML=t;
    bio.appendChild(p);
  });

  const services=document.getElementById("services-grid");
  data.services.forEach((s,i)=>services.appendChild(makeService(s,i)));

  const contactInfo=document.getElementById("contact-info");

  if(data.contact.email){
    const row=document.createElement("div");
    row.className="contact-email";
    row.innerHTML=`Email: <a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a>`;
    contactInfo.appendChild(row);
  }

  if(data.contact.phone){
    const row=document.createElement("div");
    row.className="contact-phone";
    row.innerHTML=`Phone: <a href="tel:${escapeHtml(data.contact.phone)}">${escapeHtml(data.contact.phone)}</a>`;
    contactInfo.appendChild(row);
  }

  const socials=document.createElement("div");
  socials.className="contact-socials";

  const socialEntries=[
    ["LinkedIn", data.contact.linkedin || ""],
    ["Instagram", data.contact.instagram || ""]
  ];

  socialEntries.filter(x=>x[1]).forEach(([label,href])=>{
    const a=document.createElement("a");
    a.href=href;
    a.textContent=label;
    a.target="_blank";
    a.rel="noopener noreferrer";
    socials.appendChild(a);
  });

  if(socials.children.length) contactInfo.appendChild(socials);
}).catch(err=>console.error(err));
