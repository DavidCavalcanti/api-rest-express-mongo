import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autor, livro } from "../models/index.js";

class LivroController {

  static async listarLivros(req, res, next) {
    try {
      const livrosResultado = await livro.find().populate("autor").exec();
      res.status(200).json(livrosResultado);
    } catch (erro) {
      next(erro);
    }
  }

  static async listarLivroID(req, res, next) {
    try {
      const id = req.params.id;
      const Livro = await livro.findById(id);
      if (Livro !== null) {
        res.status(200).json({ message: "Livro encontrado!", Livro });
      } else {
        next(new NaoEncontrado("Livro não encontrado!"));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async cadastrarLivro(req, res, next) {
    try {
      const novoLivro = await livro.create(req.body);
      res.status(201).json({ message: "Criado com sucesso", livro: novoLivro });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarLivro(req, res, next) {
    try {
      const { id } = req.params;
      const livroResultado = await livro.findByIdAndUpdate(id, req.body);
      if (livroResultado !== null) {
        res.status(200).json({ message: "livro atualizado!" });
      } else {
        next(new NaoEncontrado("ID do livro não encontrado."));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async deletarLivro(req, res, next) {
    try {
      const { id } = req.params;
      const livroResultado = await livro.findByIdAndDelete(id);
      if (livroResultado !== null) {
        res.status(200).json({ message: "Livro excluído com sucesso!" });
      } else {
        next(new NaoEncontrado("ID do livro não encontrado."));
      }

    } catch (erro) {
      next(erro);
    }
  }

  static async listarLivroPorFiltro(req, res, next) {          
    try {
      const busca = await processaBusca(req.query);

      const livrosEditora = await livro
        .find(busca)
        .populate("autor"); 
      if (livrosEditora) {
        res.status(200).json(livrosEditora);
      } else {
        next(new NaoEncontrado("Editora não encontrada."));
      }
    } catch (erro) {
      next(erro);
    }
  }
}

async function processaBusca(parametros){
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;
  const busca = {};

  if(editora) busca.editora = {$regex: editora, $options: "i"};
  if(titulo) busca.titulo = {$regex: titulo, $options: "i"};

  if(minPaginas || maxPaginas) busca.numeroPaginas = {};

  if(minPaginas) busca.numeroPaginas.$gte = minPaginas;
  if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if(nomeAutor) {
    const autorResultado = await autor.findOne({ nome: nomeAutor });
    
    const autorId = autorResultado._id;

    busca.autor = autorId;
  }
  return busca;
}

export default LivroController;
