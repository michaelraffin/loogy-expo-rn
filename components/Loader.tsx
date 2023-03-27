import React ,{Component}from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
// import { Instagram } from 'react-content-loader'

export const Small = (props) => (
  <ContentLoader 
    speed={2}
    width={476}
    height={124}
    viewBox="0 0 476 124"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  ><Rect x="50" y="109" rx="3" ry="3" width="88" height="6" />
    <Rect x="47" y="-25" rx="0" ry="0" width="98" height="101" />
    <Rect x="51" y="93" rx="3" ry="3" width="53" height="6" />
  </ContentLoader>
)
export const BigLoader = (props) => (
    <React.Fragment>
    
  <ContentLoader 
    speed={2}
    width={340}
    height={84}
    viewBox="0 0 340 84"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="0" y="0" rx="3" ry="3" width="67" height="11" /> 
    <Rect x="76" y="0" rx="3" ry="3" width="140" height="11" /> 
    <Rect x="127" y="48" rx="3" ry="3" width="53" height="11" /> 
    <Rect x="187" y="48" rx="3" ry="3" width="72" height="11" /> 
    <Rect x="18" y="48" rx="3" ry="3" width="100" height="11" /> 
    <Rect x="0" y="71" rx="3" ry="3" width="37" height="11" /> 
    <Rect x="18" y="23" rx="3" ry="3" width="140" height="11" /> 
    <Rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
    
  </ContentLoader>

  <ContentLoader 
    speed={2}
    width={340}
    height={84}
    viewBox="0 0 340 84"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="0" y="0" rx="3" ry="3" width="67" height="11" /> 
    <Rect x="76" y="0" rx="3" ry="3" width="140" height="11" /> 
    <Rect x="127" y="48" rx="3" ry="3" width="53" height="11" /> 
    <Rect x="187" y="48" rx="3" ry="3" width="72" height="11" /> 
    <Rect x="18" y="48" rx="3" ry="3" width="100" height="11" /> 
    <Rect x="0" y="71" rx="3" ry="3" width="37" height="11" /> 
    <Rect x="18" y="23" rx="3" ry="3" width="140" height="11" /> 
    <Rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
    
  </ContentLoader>
    </React.Fragment>
  )
   
export const ButtonLoader = (props) => (
  <React.Fragment>  
<ContentLoader 
    speed={2}
    width={1000}
    height={80}
    viewBox="0 0 1000 80"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="2" y="7" rx="3" ry="3" width="325" height="36" /> 
    <Rect x="-108" y="106" rx="3" ry="3" width="325" height="36" /> 
    <Rect x="224" y="107" rx="3" ry="3" width="133" height="36" /> 
    <Rect x="-87" y="51" rx="3" ry="3" width="325" height="36" /> 
    <Rect x="258" y="51" rx="3" ry="3" width="325" height="36" /> 
    <Rect x="341" y="6" rx="3" ry="3" width="325" height="36" />
  </ContentLoader> 
  </React.Fragment>
)  
export const TinyLoader = (props) => (
  <React.Fragment>  
<ContentLoader 
    speed={2}
    width={1000}
    height={80}
    viewBox="0 0 1000 80"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="0" y="0" rx="3" ry="3" width="67" height="11" /> 
    <Rect x="76" y="0" rx="3" ry="3" width="140" height="11" /> 
  </ContentLoader> 
  </React.Fragment>
)  


export const ButtonLoaderStandard = (props) => (
  <React.Fragment>  
<ContentLoader 
speed={4}
width={2000}
height={90}
viewBox="0 0 1000 90"
backgroundColor="#f3f3f3"
foregroundColor="#ecebeb"
{...props}
>
<Rect x="28" y="17" rx="3" ry="3" width="548" height="36" /> 
<Rect x="-108" y="106" rx="3" ry="3" width="325" height="36" /> 
<Rect x="224" y="107" rx="3" ry="3" width="133" height="36" />
</ContentLoader> 
  </React.Fragment>
) 


export const InstagramContent = (props) => (
  <ContentLoader 
      speed={2}
      width={476}
      height={124}
      viewBox="0 0 476 124"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    ><Rect x="50" y="109" rx="3" ry="3" width="88" height="6" />
      <Rect x="47" y="-25" rx="0" ry="0" width="98" height="101" />
      <Rect x="51" y="93" rx="3" ry="3" width="53" height="6" />
    </ContentLoader>
  )
  