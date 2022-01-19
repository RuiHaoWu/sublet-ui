/* eslint-disable */
export const printANSI = () => {
  let text = `
                    __      __         __ 
   _____  __  __   / /_    / /  ___   / /_
  / ___/ / / / /  / __ \\  / /  / _ \\ / __/
 (__  ) / /_/ /  / /_/ / / /  /  __// /_  
/____/  \\__,_/  /_.___/ /_/   \\___/ \\__/                        
 :: sublet ::        (v1.0.0.RELEASE)
 “房转”系统
`

console.log(`%c${text}`, 'color: #fc4d50')

console.log('%cThanks for using Sublet!', 'color: #fff; font-size: 14px; font-weight: 300; text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;')

}
