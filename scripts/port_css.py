import re,sys,os
T=os.path.expanduser("~/Local Sites/relev-studio/app/public/wp-content/themes/releve-premium/assets/css/")
BAD=re.compile(r"#masthead|\.ast-|\.woocommerce|\.main-header|wpforms|\.site-|#page|#content|\.entry-title|\.menu-|\.r-cta__form (input|textarea|button|\.wpforms)|\.releve-front|\.releve-booking-page|body:not|\.post-type-archive|\.r-mobilebar|\.comments-area|\.main-navigation|\.menu-toggle|#ast-|\.site-main|\.sub-menu|\.count|\.woocommerce-|\.releve-home, \.releve-shop")
def split(css):
    out=[];i=0;n=len(css)
    while i<n:
        m=re.compile(r"\s*(/\*.*?\*/)?\s*",re.S).match(css,i)
        i=m.end()
        if i>=n:break
        j=css.index("{",i)
        sel=css[i:j].strip()
        d=1;k=j+1
        while d:
            c=css[k]
            if c=="{":d+=1
            elif c=="}":d-=1
            k+=1
        out.append((sel,css[j+1:k-1]));i=k
    return out
kept=[];dropped=[]
def keep_rule(sel):
    # drop only if EVERY selector part is bad; else strip bad parts
    parts=[p.strip() for p in sel.split(",")]
    good=[p for p in parts if not BAD.search(p)]
    return good
for name in ["main.css","booking.css","skin.css"]:
    css=re.sub(r"/\*.*?\*/","",open(T+name).read(),flags=re.S)
    for sel,body in split(css):
        if sel.startswith("@media") or sel.startswith("@supports"):
            inner=[]
            for s2,b2 in split(body):
                g=keep_rule(s2)
                if g: inner.append(", ".join(g)+"{"+b2+"}")
                else: dropped.append(s2)
            if inner: kept.append(sel+"{\n"+"\n".join(inner)+"\n}")
        elif sel.startswith("@keyframes") or sel.startswith("@font-face"):
            kept.append(sel+"{"+body+"}")
        else:
            g=keep_rule(sel)
            if g: kept.append(", ".join(g)+"{"+body+"}")
            else: dropped.append(sel)
open("scripts/ported.css","w").write("\n".join(kept).replace("url('../img/","url('/img/"))
print("\n".join(d[:110] for d in dropped))
