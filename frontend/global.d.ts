// global.d.ts
declare global {
    namespace NodeJS {
       interface Global {
         env: string;
       }
    }
   }
   