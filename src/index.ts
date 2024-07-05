import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import fs from 'fs';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors())

//* rota principal
app.get('/pedidos', (req, res) => {
  const data = fs.readFileSync(__dirname + '/base.json', 'utf-8');

  try {
    const jsonData = JSON.parse(data);
    res.send(jsonData);
    return
  } catch (error) {
    res.status(500).send({ error: "Erro na leitura do arquivo JSON" });
  }

  return;
});

//* segunda rota resumo dos pedidos
app.get('/pedidos/resumoStatus', (req: Request, res: Response) => {
  const data = fs.readFileSync(__dirname + '/base.json', 'utf-8');

  const jsonData = JSON.parse(data);

  //* Inicialize as contagens para cada status
  let qtdStatusProcessando = 0;
  let qtdStatusPendente = 0;
  let qtdStatusAprovado = 0;
  let qtdStatusCancelado = 0;

  //* Itere sobre os pedidos e conte a quantidade para cada status
  for (const pedido of jsonData) {
    switch (pedido.status) {
      case 'PROCESSANDO':
        qtdStatusProcessando++;
        break;
      case 'PENDENTE':
        qtdStatusPendente++;
        break;
      case 'APROVADO':
        qtdStatusAprovado++;
        break;
      case 'CANCELADO':
        qtdStatusCancelado++;
        break;
      default:
    }
  }

  // calcule a quantidade total de pedidos
  const qtdTotalPedidos = jsonData.length;

  // cria o json que resume os resultados
  const resumoStatus = {
    qtdStatusProcessando,
    qtdStatusPendente,
    qtdStatusAprovado,
    qtdStatusCancelado,
    qtdTotalPedidos,
  };

  res.json(resumoStatus);
});

// terceira rota total de vendas
app.get('/pedidos/totalVendas', (req: Request, res: Response) => {
  const data = fs.readFileSync(__dirname + '/base.json', 'utf-8');

  const jsonData = JSON.parse(data);

  let totalVendas = 0;

  // valcula o valor com a exeção dos pedidos cacelados
  for (const pedido of jsonData) {
    if (pedido.status !== 'CANCELADO') {
      totalVendas += pedido.valor;
    }
  }

  // const numeroArredondado = Math.ceil(totalVendas)

  const totalVendasObj = {
    totalVendas: totalVendas,
  };


  res.json(totalVendasObj);
});


app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
