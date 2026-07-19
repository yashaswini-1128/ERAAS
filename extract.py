import re
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()
script = html.split('<script type="text/babel" data-presets="react">')[1].split('</script>')[0]
with open('temp.jsx', 'w', encoding='utf-8') as f:
    f.write(script)
