db.tweets.mapReduce(
  function() {

    // Precisamos salvar isso em uma var local, conforme os problemas de escopo
    var document = this;

    // Voc� precisa expandir isso de acordo com suas necessidades
    var stopwords = ["de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "com", "n�o", "uma", "os", "no", "se", "na", 
      "por", "mais", "as", "dos", "como", "mas", "ao", "ele", "das", "�", "seu", "sua", "ou", "quando", "muito", "nos", 
      "j�", "eu", "tamb�m", "s�", "pelo", "pela", "at�", "isso", "ela", "entre", "depois", "sem", "mesmo", "aos", "seus", 
      "quem", "nas", "me", "esse", "eles", "voc�", "essa", "num", "nem", "suas", "meu", "�s", "minha", "numa", "pelos", 
      "elas", "qual", "n�s", "lhe", "deles", "essas", "esses", "pelas", "este", "dele", "tu", "te", "voc�s", "vos", "lhes", 
      "meus", "minhas", "teu", "tua", "teus", "tuas", "nosso", "nossa", "nossos", "nossas", "dela", "delas", "esta", 
      "estes", "estas", "aquele", "aquela", "aqueles", "aquelas", "isto", "aquilo", "estou", "est�", "estamos", "est�o", 
      "estive", "esteve", "estivemos", "estiveram", "estava", "est�vamos", "estavam", "estivera", "estiv�ramos", "esteja", 
      "estejamos", "estejam", "estivesse", "estiv�ssemos", "estivessem", "estiver", "estivermos", "estiverem", "hei", "h�", 
      "havemos", "h�o", "houve", "houvemos", "houveram", "houvera", "houv�ramos", "haja", "hajamos", "hajam", "houvesse", 
      "houv�ssemos", "houvessem", "houver", "houvermos", "houverem", "houverei", "houver�", "houveremos", "houver�o", 
      "houveria", "houver�amos", "houveriam", "sou", "somos", "s�o", "era", "�ramos", "eram", "fui", "foi", "fomos", "foram", 
      "fora", "f�ramos", "seja", "sejamos", "sejam", "fosse", "f�ssemos", "fossem", "for", "formos", "forem", "serei", "ser�", 
      "seremos", "ser�o","seria", "ser�amos", "seriam", "tenho", "tem", "temos", "t�m", "tinha", "t�nhamos", "tinham", "tive", 
      "teve", "tivemos", "tiveram", "tivera", "tiv�ramos", "tenha", "tenhamos", "tenham", "tivesse", "tiv�ssemos", "tivessem", 
      "tiver", "tivermos", "tiverem", "terei", "ter�", "teremos", "ter�o", "teria", "ter�amos", "teriam","�","http","https"];

    // Isso denota os campos que devem ser processados
    var fields = ["text"];
    
    // Para cada campo...
    fields.forEach(

      function(field){

        // ... Dividimos o campo em palavras �nicas...
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

              // ...� um flutuador ou um n�mero inteiro... 
              !(isNaN(parseInt(cleaned))) ||
              !(isNaN(parseFloat(cleaned))) ||

              // Ou � apenas um personagem.
              cleaned.length < 2
            )
            {
              // Em qualquer um desses casos, n�o queremos ter a palavra atual em nossa lista.
              return
            }
              // Caso contr�rio, queremos que a palavra atual seja processada.
              // Note que devemos usar um ID multi-chave e um campo est�tico para
              // para superar uma das limita��es de MapReduce do MongoDB:
              // n�o pode ter v�rios valores atribu�dos a uma chave.
              emit({'word':cleaned,'doc':document._id,'field':field},1)

          }
        )
      }
    )
  },
  function(key,values) {
    // Resumimos cada ocorr�ncia de cada palavra
    // em cada campo em cada documento ...
    return Array.sum(values);
  },
    // .. e escreva o resultado para uma cole��o
  {out: "tweets1"}
)
