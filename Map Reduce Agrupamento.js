db.tweets1.aggregate(
  // Nós combinamos insensível a maiúsculas e minúsculas ("i") como queremos impedir
  // erros de digitação para reduzir nossos resultados de pesquisa
  { $match:{"_id.word":/^S/i} },
  { $group:{
      // Aqui é onde a magia acontece:
      // criamos uma lista de palavras distintas ...
      _id:"$_id.word",
      occurrences:{
        // ... adicione cada ocorrência a uma matriz ...
        $push:{
          doc:"$_id.doc",
          field:"$_id.field"
        } 
      },
      // ... e adicione todas as ocorrências a uma pontuação
      // Note que isso é opcional e pode ser ignorado
      // para acelerar as coisas, como devemos ter uma consulta coberta
      // quando não está acessando $ valor, embora eu não tenha muita certeza disso
      score:{$sum:"$value"}
    }
  },
  {
    // Opcional. Veja acima
    $sort:{_id:-1,score:1}
  }
) 