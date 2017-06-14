db.tweets.mapReduce(
  function() {

    // Precisamos salvar isso em uma var local, conforme os problemas de escopo
    var document = this;

    // Você precisa expandir isso de acordo com suas necessidades
    var stopwords = ["de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "com", "não", "uma", "os", "no", "se", "na", 
      "por", "mais", "as", "dos", "como", "mas", "ao", "ele", "das", "à", "seu", "sua", "ou", "quando", "muito", "nos", 
      "já", "eu", "também", "só", "pelo", "pela", "até", "isso", "ela", "entre", "depois", "sem", "mesmo", "aos", "seus", 
      "quem", "nas", "me", "esse", "eles", "você", "essa", "num", "nem", "suas", "meu", "às", "minha", "numa", "pelos", 
      "elas", "qual", "nós", "lhe", "deles", "essas", "esses", "pelas", "este", "dele", "tu", "te", "vocês", "vos", "lhes", 
      "meus", "minhas", "teu", "tua", "teus", "tuas", "nosso", "nossa", "nossos", "nossas", "dela", "delas", "esta", 
      "estes", "estas", "aquele", "aquela", "aqueles", "aquelas", "isto", "aquilo", "estou", "está", "estamos", "estão", 
      "estive", "esteve", "estivemos", "estiveram", "estava", "estávamos", "estavam", "estivera", "estivéramos", "esteja", 
      "estejamos", "estejam", "estivesse", "estivéssemos", "estivessem", "estiver", "estivermos", "estiverem", "hei", "há", 
      "havemos", "hão", "houve", "houvemos", "houveram", "houvera", "houvéramos", "haja", "hajamos", "hajam", "houvesse", 
      "houvéssemos", "houvessem", "houver", "houvermos", "houverem", "houverei", "houverá", "houveremos", "houverão", 
      "houveria", "houveríamos", "houveriam", "sou", "somos", "são", "era", "éramos", "eram", "fui", "foi", "fomos", "foram", 
      "fora", "fôramos", "seja", "sejamos", "sejam", "fosse", "fôssemos", "fossem", "for", "formos", "forem", "serei", "será", 
      "seremos", "serão","seria", "seríamos", "seriam", "tenho", "tem", "temos", "tém", "tinha", "tínhamos", "tinham", "tive", 
      "teve", "tivemos", "tiveram", "tivera", "tivéramos", "tenha", "tenhamos", "tenham", "tivesse", "tivéssemos", "tivessem", 
      "tiver", "tivermos", "tiverem", "terei", "terá", "teremos", "terão", "teria", "teríamos", "teriam","é","http","https"];

    // Isso denota os campos que devem ser processados
    var fields = ["text"];
    
    // Para cada campo...
    fields.forEach(

      function(field){

        // ... Dividimos o campo em palavras únicas...
        var words = (document[field]).split(" ");

        words.forEach(

          function(word){
            // ...E remover caracteres indesejados.
            // Por favor, note que esta regex pode muito bem precisar de ser melhorada
            var cleaned = word.replace(/[/^;@,.?:()|?\#]/,"")

            // Em seguida, verificamos...
            if(
              // ...Se a palavra atual estiver na lista de palavras-chave,...
              (stopwords.indexOf(word)>-1) ||

              // ...É um flutuador ou um número inteiro... 
              !(isNaN(parseInt(cleaned))) ||
              !(isNaN(parseFloat(cleaned))) ||

              // Ou é apenas um personagem.
              cleaned.length < 2
            )
            {
              // Em qualquer um desses casos, não queremos ter a palavra atual em nossa lista.
              return
            }
              // Caso contrário, queremos que a palavra atual seja processada.
              // Note que devemos usar um ID multi-chave e um campo estático para
              // para superar uma das limitações de MapReduce do MongoDB:
              // não pode ter vários valores atribuídos a uma chave.
              emit({'word':cleaned,'doc':document._id,'field':field},1)

          }
        )
      }
    )
  },
  function(key,values) {
    // Resumimos cada ocorrência de cada palavra
    // em cada campo em cada documento ...
    return Array.sum(values);
  },
    // .. e escreva o resultado para uma coleção
  {out: "tweets1"}
)
