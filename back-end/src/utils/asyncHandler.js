export const asyncHandler = (handleledFn)=>{
    try {
        return (req,res,next)=>{
            Promise.resolve(handleledFn(req,res,next))
        }
    } catch (error) {
        next(error);
    }
}