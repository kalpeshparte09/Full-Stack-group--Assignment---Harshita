module.exports = (req,res,next)=>{
    if(req.files==null||req.body.title==null){
      return res.redirect('/g')
    }
    next()
  };