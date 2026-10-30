"""Dependency-free checks for local site navigation and deployment compatibility."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.labels=[];self.h1=0;self.inline=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='label' and 'for' in a:self.labels.append(a['for'])
  if 'style' in a:self.inline.append(tag)
  for k in ('href','src'):
   if k in a:self.links.append(a[k])
pages={p.name:Page(p.read_text()) for p in root.glob('*.html')}
for name,page in pages.items():
 assert page.h1==1,(name,'expected one h1')
 assert len(page.ids)==len(set(page.ids)),(name,'duplicate ids')
 assert not page.inline,(name,'inline style blocked by CSP')
 for label in page.labels:assert label in page.ids,(name,label,'missing input')
 for link in page.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  dest=unquote(u.path) or name
  if dest.startswith('/'):dest=dest[1:] or 'index.html'
  assert (root/dest).exists(),(name,link,'missing local target')
  if u.fragment and dest in pages:assert unquote(u.fragment) in pages[dest].ids,(name,link,'missing fragment')
for name in ('site.js','styles.css'):assert (root/name).read_bytes()==(root/'assets'/name).read_bytes(),name+' mirror differs'
for path in root.glob('*.html'):
 text=path.read_text()
 import re
 for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):json.loads(block)
ET.parse(root/'sitemap.xml')
assert (root/'assets/city-of-cape-town-logo.png').read_bytes().startswith(b'\x89PNG\r\n\x1a\n')
print(f'PASS: {len(pages)} pages; local links, fragments, labels, CSS policy, script/style mirrors, metadata and logo.')
