db.tweets1.aggregate(
  {
    $group:{
      _id:"$_id.word",
      occurences:{ $push:{doc:"$_id.doc",field:"$_id.field"}},
      score:{$sum:"$value"}
     }
   },{
     $out:"tweets2"
   })
