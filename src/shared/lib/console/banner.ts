const ICON = `                          
HHHHHHHHHH  NNNNNNNNNNNNNN              
HHHHHHHHHH  NNNNNNNNNNNNNNNNN           
HHHHHHHHHH  NNNNNNNNNNNNNNNNNNNN        
HHHHHHHHHH  NNNNNNNNNNNNNNNNNNNNNN      
HHHHHHHHHH  NNNNNNNNNNNNNNNNNNNNNNN     
HHHHHHHHHH  NNNNNNNNNNNNNNNNNNNNNNNNN   
FFFFFFFFFF             NNNNNNNNNNNNNNN  
FFFFFFFFFF                NNNNNNNNNNNN  
FFFFFFFFFF                 NNNNNNNNNNNN 
FFFFFFFFFF                  NNNNNNNNNNNN
FFFFFFFFFF                   NNNNNNNNNNN
FFFFFFFFFF                    NNNNNNNNNN
FFFFFFFFFF                    NNNNNNNNNN
FFFFFFFFFF                    NNNNNNNNNN
FFFFFFFFFF                   NNNNNNNNNNN
FFFFFFFFFF                  NNNNNNNNNNNN
FFFFFFFFFF                 NNNNNNNNNNNN 
FFFFFFFFFF               NNNNNNNNNNNNN  
FFFFFFFFFF             NNNNNNNNNNNNNNN  
FFFFFFFFFFNNNNNNNNNNNNNNNNNNNNNNNNNNN   
FFFFFFFFFFNNNNNNNNNNNNNNNNNNNNNNNNN     
FFFFFFFFFFNNNNNNNNNNNNNNNNNNNNNNNN      
FFFFFFFFFFNNNNNNNNNNNNNNNNNNNNNN        
FFFFFFFFFFNNNNNNNNNNNNNNNNNNN           
FFFFFFFFFFNNNNNNNNNNNNNNNN                                                                                                                                                                        

 AAAAAA       AAA      AAAAAAA  AAAAAAAA
AA    AA     AAAA      A     AA      AAA
AA     AA  AA  AA           AA      AA  
AA     AA AA   AA         AAA      AA   
AA    AA AAAAAAAAA       AA       AA    
 AAAAAA        AA  AA  AAAAAAAA  AA     

███ ████   ███ ████████   ███   ███  ████████ ███    
███ █████  ███ ███   ███  ███   ███  ███      ███    
███ ██████████ ███    ██  ███   ███  ███████  ███    
███ ███  █████ ███   ███  ███   ███  ███      ███    
███ ███   ████ ████████    ███████   ████████ ███████
`;

export function printAsciiBanner() {
  if (import.meta.env.MODE !== 'production') return;
  console.log(ICON);
}
