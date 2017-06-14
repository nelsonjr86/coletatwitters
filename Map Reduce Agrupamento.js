db.tweets1.aggregate(
  // N�s combinamos insens�vel a mai�sculas e min�sculas ("i") como queremos impedir
  // erros de digita��o para reduzir nossos resultados de pesquisa
  { $match:{"_id.word":/^S/i} },
  { $group:{
      // Aqui � onde a magia acontece:
      // criamos uma lista de palavras distintas ...
      _id:"$_id.word",
      occurrences:{
        // ... adicione cada ocorr�ncia a uma matriz ...
        $push:{
          doc:"$_id.doc",
          field:"$_id.field"
        } 
      },
      // ... e adicione todas as ocorr�ncias a uma pontua��o
      // Note que isso � opcional e pode ser ignorado
      // para acelerar as coisas, como devemos ter uma consulta coberta
      // quando n�o est� acessando $ valor, embora eu n�o tenha muita certeza disso
      score:{$sum:"$value"}
    }
  },
  {
    // Opcional. Veja acima
    $sort:{_id:-1,score:1}
  }
) 