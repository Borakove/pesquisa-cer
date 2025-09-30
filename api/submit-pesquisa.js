export default async (request, response) => {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    try {
        const formData = request.body;

        const record = {
            timestamp: new Date().toISOString(),
            ...formData,
        };

        console.log("--- DADOS DE PESQUISA RECEBIDOS ---");
        console.log(JSON.stringify(record, null, 2));
        console.log("-----------------------------------");
        
        response.status(200).json({ 
            message: 'Pesquisa recebida com sucesso! Dados registrados no servidor.',
            id: record.timestamp 
        });

    } catch (error) {
        console.error('Erro ao processar dados:', error);
        response.status(500).json({ error: 'Falha interna do servidor ao processar a pesquisa.' });
    }
};