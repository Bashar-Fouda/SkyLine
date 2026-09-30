/**
 * Skyline - Accurate World Map (same as before, fixed for luxury theme)
 * Uses real lat/lng, Robinson projection, no external deps
 */
const DESTINATIONS = [
  { code: 'AMM', city: 'Amman', country: 'JO', lat: 31.7226, lng: 35.9932, price: 0, flights: 99, hub: true },
  { code: 'CAI', city: 'Cairo', country: 'EG', lat: 30.1219, lng: 31.4056, price: 165, flights: 28 },
  { code: 'RUH', city: 'Riyadh', country: 'SA', lat: 24.7136, lng: 46.6753, price: 135, flights: 26 },
  { code: 'JED', city: 'Jeddah', country: 'SA', lat: 21.6796, lng: 39.1565, price: 145, flights: 24 },
  { code: 'DOH', city: 'Doha', country: 'QA', lat: 25.2854, lng: 51.5310, price: 175, flights: 22 },
  { code: 'DXB', city: 'Dubai', country: 'AE', lat: 25.2532, lng: 55.3657, price: 189, flights: 21 },
  { code: 'TLV', city: 'Tel Aviv', country: 'IL', lat: 32.0114, lng: 34.8867, price: 110, flights: 20 },
  { code: 'IST', city: 'Istanbul', country: 'TR', lat: 41.2753, lng: 28.7519, price: 199, flights: 16 },
  { code: 'ATH', city: 'Athens', country: 'GR', lat: 37.9364, lng: 23.9445, price: 210, flights: 14 },
  { code: 'LON', city: 'London', country: 'GB', lat: 51.4700, lng: -0.4543, price: 245, flights: 12 },
  { code: 'PAR', city: 'Paris', country: 'FR', lat: 49.0097, lng: 2.5479, price: 265, flights: 11 },
  { code: 'NYC', city: 'New York', country: 'US', lat: 40.6413, lng: -73.7781, price: 445, flights: 7 },
  { code: 'BKK', city: 'Bangkok', country: 'TH', lat: 13.6900, lng: 100.7501, price: 389, flights: 6 },
];

function latLngToPixel(lat, lng, w, h) {
  let x = (lng + 180) / 360 * w;
  const yFactor = 0.5 - (lat / 180) * 0.88;
  let y = yFactor * h;
  x = x * 0.92 + w * 0.04;
  y = y * 0.88 + h * 0.06;
  return { x, y };
}
function haversine(lat1,lng1,lat2,lng2){
  const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return Math.round(2*R*Math.asin(Math.sqrt(a)));
}
let mapW=0,mapH=0;
function initAccurateMap(){
  const container=document.getElementById('mapContainer');
  if(!container) return;
  const update=()=>{
    mapW=container.clientWidth; mapH=container.clientHeight; renderDots();
  };
  window.addEventListener('resize',update); update();
}
function renderDots(filter=''){
  const overlay=document.getElementById('mapOverlay'); if(!overlay) return;
  overlay.innerHTML='';
  const hub=DESTINATIONS.find(d=>d.hub);
  const filtered=DESTINATIONS.filter(d=>!filter||d.city.toLowerCase().includes(filter.toLowerCase())||d.code.toLowerCase().includes(filter.toLowerCase()));
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
  svg.style.position='absolute'; svg.style.inset='0';
  filtered.forEach(dest=>{
    if(dest.hub) return;
    const hp=latLngToPixel(hub.lat,hub.lng,mapW,mapH);
    const dp=latLngToPixel(dest.lat,dest.lng,mapW,mapH);
    const mx=(hp.x+dp.x)/2; const my=(hp.y+dp.y)/2-Math.abs(dp.x-hp.x)*0.1;
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',`M ${hp.x} ${hp.y} Q ${mx} ${my} ${dp.x} ${dp.y}`);
    p.setAttribute('class','map-route'); p.setAttribute('id',`route-${dest.code}`);
    svg.appendChild(p);
  });
  overlay.appendChild(svg);
  filtered.forEach(dest=>{
    const pos=latLngToPixel(dest.lat,dest.lng,mapW,mapH);
    const dot=document.createElement('div');
    dot.className=`map-dot ${dest.hub?'hub':''}`;
    dot.style.left=pos.x+'px'; dot.style.top=pos.y+'px';
    if(!dest.hub){
      if(dest.price<150) dot.style.background='#10B981';
      else if(dest.price<250) dot.style.background='#0077B6';
      else dot.style.background='#FF4D2E';
    }
    dot.dataset.code=dest.code;
    dot.addEventListener('mouseenter',e=>showTooltip(e,dest));
    dot.addEventListener('mouseleave',hideTooltip);
    dot.addEventListener('click',()=>selectDestination(dest));
    overlay.appendChild(dot);
  });
}
function showTooltip(e,dest){
  const hub=DESTINATIONS.find(d=>d.hub);
  const dist=haversine(hub.lat,hub.lng,dest.lat,dest.lng);
  let tip=document.getElementById('mapTooltip');
  if(!tip){ tip=document.createElement('div'); tip.id='mapTooltip'; tip.className='map-tooltip'; document.getElementById('mapContainer').appendChild(tip); }
  tip.innerHTML=`${dest.city} ${dest.code} • $${dest.price} • ${dist} km • ${dest.flights} flights/week`;
  tip.style.left=e.target.style.left; tip.style.top=e.target.style.top; tip.style.display='block';
  const route=document.getElementById(`route-${dest.code}`);
  if(route){ route.style.stroke='#023E8A'; route.style.strokeWidth='2'; }
}
function hideTooltip(){
  const tip=document.getElementById('mapTooltip'); if(tip) tip.style.display='none';
  document.querySelectorAll('.map-route').forEach(r=>{ r.style.stroke=''; r.style.strokeWidth=''; });
}
function selectDestination(dest){
  if(typeof showBanner!=='undefined') showBanner(`Selected ${dest.city} - ${dest.code} • $${dest.price}`);
  if(typeof showToast!=='undefined') showToast(`✈️ ${dest.city} offers`);
  const modal=document.getElementById('offersModal');
  if(modal){
    const c=document.getElementById('modalCity'); if(c) c.textContent=dest.city;
    const code=document.getElementById('modalCode'); if(code) code.textContent=dest.code;
    const price=document.getElementById('modalPrice'); if(price) price.textContent='$'+dest.price;
    modal.style.display='flex';
  }
}
function filterMap(q){ renderDots(q); if(typeof showBanner!=='undefined') showBanner(`Filter: ${q||'All'} - ${document.querySelectorAll('.map-dot').length} destinations`); }
document.addEventListener('DOMContentLoaded',initAccurateMap);
window.filterMap=filterMap;
