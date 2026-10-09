(function(){
var S=window.STORE,P=window.PRODUCTS,$=function(i){return document.getElementById(i)},KEY='shop:cart',cart={},cat='All';
var r=document.documentElement.style;r.setProperty('--accent',S.colors.accent);r.setProperty('--accent2',S.colors.accent2);
document.title=S.name;$('name').textContent=S.name;$('tag').textContent=S.tagline;$('foot').textContent='© '+new Date().getFullYear()+' '+S.name;
if(!S.email)$('em').hidden=true;
function m(n){return S.currency+Number(n).toLocaleString(S.locale)}
function esc(t){var d=document.createElement('div');d.textContent=t==null?'':String(t);return d.innerHTML}
$('free').textContent=m(S.freeShippingOver);
try{cart=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
function find(id){return P.find(function(p){return p.id==id})}
// categories
var cats=['All'].concat(P.map(function(p){return p.category}).filter(function(c,i,a){return a.indexOf(c)===i}));
$('cats').innerHTML=cats.map(function(c){return'<button aria-pressed="'+(c===cat)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('');
$('cats').onclick=function(e){var b=e.target.closest('button');if(!b)return;cat=b.dataset.c;Array.prototype.forEach.call($('cats').children,function(x){x.setAttribute('aria-pressed',x===b)});draw()};
$('q').oninput=draw;$('sort').onchange=draw;
function draw(){
 var q=$('q').value.toLowerCase().trim(),s=$('sort').value;
 var l=P.filter(function(p){return(cat==='All'||p.category===cat)&&(!q||(p.name+' '+p.desc+' '+p.category).toLowerCase().indexOf(q)>-1)});
 if(s==='lo')l.sort(function(a,b){return a.price-b.price});if(s==='hi')l.sort(function(a,b){return b.price-a.price});if(s==='rt')l.sort(function(a,b){return b.rating-a.rating});
 $('res').textContent=l.length+(l.length===1?' product':' products');
 $('grid').innerHTML=l.length?l.map(function(p){var off=p.mrp>p.price?Math.round((1-p.price/p.mrp)*100):0;
  return'<article class="p"><img src="'+esc(p.img)+'" alt="'+esc(p.name)+'" data-v="'+p.id+'" loading="lazy"><div class="pb"><button class="pn" data-v="'+p.id+'">'+esc(p.name)+'</button><span class="mut">★ '+p.rating+' · '+esc(p.category)+'</span><span class="price"><b>'+m(p.price)+'</b>'+(off?'<s>'+m(p.mrp)+'</s><span class="off">'+off+'% off</span>':'')+'</span>'+
  (p.stock>0?'<button class="add pri" data-a="'+p.id+'">Add to cart</button>':'<span class="out">Out of stock</span>')+'</div></article>'}).join(''):'<p class="mut">No products match. Try a different search or category.</p>'}
$('grid').onclick=function(e){var a=e.target.closest('[data-a]'),v=e.target.closest('[data-v]');if(a)add(a.dataset.a);else if(v)view(v.dataset.v)};
// modal
function view(id){var p=find(id);$('mbody').innerHTML='<div class="det"><img src="'+esc(p.img)+'" alt="'+esc(p.name)+'"><div><h2 style="margin-top:0">'+esc(p.name)+'</h2><p class="mut">★ '+p.rating+' · '+esc(p.category)+'</p><p>'+esc(p.desc)+'</p><p class="price"><b>'+m(p.price)+'</b>'+(p.mrp>p.price?'<s>'+m(p.mrp)+'</s>':'')+'</p>'+(p.stock>0?(p.stock<10?'<p class="out">Only '+p.stock+' left</p>':'')+'<button class="pri" data-a="'+p.id+'">Add to cart</button>':'<p class="out">Out of stock</p>')+'</div></div>';$('modal').hidden=false;$('mx').focus()}
$('mbody').onclick=function(e){var a=e.target.closest('[data-a]');if(a){add(a.dataset.a);$('modal').hidden=true}};
$('mx').onclick=function(){$('modal').hidden=true};$('modal').onclick=function(e){if(e.target===this)this.hidden=true};
// cart
function add(id){var p=find(id);if(!p||p.stock<1)return;cart[id]=Math.min((cart[id]||0)+1,p.stock);save();paint();openCart()}
function openCart(){$('drawer').hidden=false;$('veil').hidden=false}function closeCart(){$('drawer').hidden=true;$('veil').hidden=true}
$('cartbtn').onclick=openCart;$('dx').onclick=closeCart;$('veil').onclick=closeCart;
document.onkeydown=function(e){if(e.key==='Escape'){closeCart();$('modal').hidden=true}};
$('items').onclick=function(e){var b=e.target.closest('[data-q]');if(!b)return;var id=b.dataset.id,p=find(id),n=(cart[id]||0)+(+b.dataset.q);if(n<=0)delete cart[id];else cart[id]=Math.min(n,p.stock);save();paint()};
function totals(){var sub=0,n=0;Object.keys(cart).forEach(function(id){var p=find(id);if(p){sub+=p.price*cart[id];n+=cart[id]}});var ship=sub===0||sub>=S.freeShippingOver?0:S.shipping,tax=Math.round(sub*S.taxPercent/100);return{sub:sub,n:n,ship:ship,tax:tax,total:sub+ship+tax}}
function paint(){var t=totals();$('count').textContent=t.n;
 $('items').innerHTML=t.n?Object.keys(cart).map(function(id){var p=find(id);if(!p){delete cart[id];return''}return'<div class="it"><img src="'+esc(p.img)+'" alt=""><div><div>'+esc(p.name)+'</div><div class="mut">'+m(p.price)+'</div><div class="q"><button data-id="'+id+'" data-q="-1" aria-label="Decrease">−</button>'+cart[id]+'<button data-id="'+id+'" data-q="1" aria-label="Increase">+</button></div></div><b>'+m(p.price*cart[id])+'</b></div>'}).join(''):'<p class="mut">Your cart is empty. Add a product to get started.</p>';
 $('sum').innerHTML=t.n?'<div><span>Subtotal</span><span>'+m(t.sub)+'</span></div><div><span>Shipping</span><span>'+(t.ship?m(t.ship):'Free')+'</span></div>'+(S.taxPercent?'<div><span>Tax ('+S.taxPercent+'%)</span><span>'+m(t.tax)+'</span></div>':'')+'<div class="t"><span>Total</span><span>'+m(t.total)+'</span></div>':'';
 $('co').querySelector('.pri').disabled=!t.n}
function text(){var t=totals(),l=['New order from '+$('cn').value.trim()+' ('+$('cp').value.trim()+')',''];
 Object.keys(cart).forEach(function(id){var p=find(id);l.push(cart[id]+' x '+p.name+' = '+m(p.price*cart[id]))});
 l.push('','Shipping: '+(t.ship?m(t.ship):'Free'),'Total: '+m(t.total),'','Deliver to: '+$('ca').value.trim());return l.join('\n')}
$('co').onsubmit=function(e){e.preventDefault();if(!totals().n)return;window.open('https://wa.me/'+S.whatsapp+'?text='+encodeURIComponent(text()),'_blank');$('msg').textContent='WhatsApp opened with your order. Send the message to confirm it.'};
$('em').onclick=function(){if(!$('co').reportValidity()||!totals().n)return;location.href='mailto:'+S.email+'?subject='+encodeURIComponent('New order')+'&body='+encodeURIComponent(text())};
draw();paint();
})();
