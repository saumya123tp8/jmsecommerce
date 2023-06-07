import bcrypt from'bcrypt'
// 2  fn create fst to encrypt scnd is for compare

export const hashPassword=async(password)=>{
    try{
     const saltRounds=10;
     const hashedPassword=await bcrypt.hash(password,saltRounds);
     return hashedPassword
    }catch(error){
        console.log(error);
    }
}

export const comparePassword= async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}

