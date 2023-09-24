import livro from "../models/Livro.js";

class LivroController {

    static async listarLivros(req, res) {
        try {
            const livrosResultado = await livro.find();
            res.status(200).json(livrosResultado)
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha na requisição` });
        }
    }

    static async listarLivroID(req, res) {
        try {
            const id = req.params.id;
            const livroID = await livro.findById(id);
            res.status(200).json(livroID);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Falha na requisição do livro` });
        }
    }

    static async cadastrarLivro(req, res) {
        try {
            const novoLivro = await livro.create(req.body);
            res.status(201).json({ message: "Criado com sucesso", livro: novoLivro });
        } catch (erro) {
            res.status(500).json({ message: `${erro} - falha ao cadastrar livro` });
        }
    }

    static async atualizarLivro(req, res) {
        try {
            const { id } = req.params;
            await livro.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "livro atualizado!" });
        } catch (erro) {
            res.status(500).json({ message: `${erro} - falha na atualização` });
        }
    }

    static async deletarLivro(req, res) {
        try {
            const { id } = req.params
            await livro.findByIdAndDelete(id);
            res.status(200).json({ message: "Livro excluído com sucesso!" })
        } catch (Erro) {
            res.status(500).json({ message: `${erro} - falha na exclusão` });
        }
    }

};

export default LivroController;