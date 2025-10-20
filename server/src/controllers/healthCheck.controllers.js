import { asyncHandler } from "../utils/asyncHandler.js";
const healthCheck=asyncHandler(async(req,res)=>{
  res.status(200)
  .json({
     success:true,
     message:"sever is running............."
  })
});
export{healthCheck}