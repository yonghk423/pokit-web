from pathlib import Path
import struct,json,zipfile
root=Path(__file__).resolve().parent.parent
reports=[]
for locale in ['kr','ja','us']:
 files=sorted((root/locale).glob('*.png'))
 assert len(files)==6,(locale,len(files))
 for f in files:
  data=f.read_bytes();w,h,bit,ctype=struct.unpack('>IIBB',data[16:26])
  assert (w,h,bit,ctype)==(1320,2868,8,2),(f.name,w,h,bit,ctype)
  reports.append({'file':str(f.relative_to(root)),'width':w,'height':h,'bitDepth':bit,'colorType':'RGB','alpha':False,'bytes':len(data)})
 with zipfile.ZipFile(root/f'{locale}.zip','w',zipfile.ZIP_STORED) as z:
  for f in files:z.write(f,f.relative_to(root))
(root/'validation.json').write_text(json.dumps({'images':len(reports),'passed':True,'files':reports},indent=2))
with zipfile.ZipFile(root/'your-day-appstore-6.9-all-locales.zip','w',zipfile.ZIP_STORED) as z:
 for locale in ['kr','ja','us']:
  for f in sorted((root/locale).glob('*.png')):z.write(f,f.relative_to(root))
 for f in sorted((root/'previews').glob('*.jpg')):z.write(f,f.relative_to(root))
 for name in ['index.html','README.md','manifest.json','validation.json']:z.write(root/name,name)
print(json.dumps({'images':len(reports),'all_valid':True,'zip_bytes':(root/'your-day-appstore-6.9-all-locales.zip').stat().st_size}))
