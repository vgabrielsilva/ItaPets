
document.addEventListener('DOMContentLoaded', function() {

    const cartHtml = `
        <button id="btn-carrinho-flutuante" class="btn btn-primary rounded-circle shadow" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCarrinho" aria-controls="offcanvasCarrinho" style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; z-index: 9999; font-size: 24px; display: flex; align-items: center; justify-content: center;">
            🛒
            <span id="contador-carrinho" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 12px; display: none;">
                0
            </span>
        </button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCarrinho" aria-labelledby="offcanvasCarrinhoLabel">
            <div class="offcanvas-header bg-primary text-white">
                <h5 class="offcanvas-title" id="offcanvasCarrinhoLabel">Seu Carrinho</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <div id="lista-itens" class="flex-grow-1 overflow-auto">
                    <p class="text-center text-muted mt-5">Seu carrinho está vazio.</p>
                </div>
                <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between mb-3">
                        <span class="h5">Total:</span>
                        <span class="h5" id="total-carrinho">R$ 0,00</span>
                    </div>
                    <a href="contato.html" class="btn btn-success w-100 btn-lg">Finalizar Pedido</a>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cartHtml);

    function getCarrinho() {
        return JSON.parse(localStorage.getItem('itaPetsCarrinho')) || [];
    }

    function salvarCarrinho(itens) {
        localStorage.setItem('itaPetsCarrinho', JSON.stringify(itens));
        atualizarInterface();
    }

    function atualizarInterface() {
        const itens = getCarrinho();
        const listaEl = document.getElementById('lista-itens');
        const contadorEl = document.getElementById('contador-carrinho');
        const totalEl = document.getElementById('total-carrinho');

        if (itens.length > 0) {
            contadorEl.style.display = 'block';
            contadorEl.innerText = itens.length;
        } else {
            contadorEl.style.display = 'none';
        }

        if (itens.length === 0) {
            listaEl.innerHTML = '<p class="text-center text-muted mt-5">Seu carrinho está vazio.</p>';
            totalEl.innerText = 'R$ 0,00';
            return;
        }

        let htmlItens = '<ul class="list-group list-group-flush">';
        let total = 0;

        itens.forEach((item, index) => {

            let precoNumerico = parseFloat(item.preco.replace('R$', '').replace('.', '').replace(',', '.'));
            total += precoNumerico;

            htmlItens += `
                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div class="d-flex align-items-center">
                        <img src="${item.imagem}" alt="img" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                        <div>
                            <div class="fw-bold" style="font-size: 0.9rem;">${item.nome}</div>
                            <small class="text-muted">${item.preco}</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger btn-remover" data-index="${index}">&times;</button>
                </li>
            `;
        });
        htmlItens += '</ul>';
        listaEl.innerHTML = htmlItens;

        totalEl.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removerItem(index);
            });
        });
    }

    function removerItem(index) {
        let itens = getCarrinho();
        itens.splice(index, 1);
        salvarCarrinho(itens);
    }

    function adicionarItemAtual() {
        const nomeProduto = document.querySelector('.produto-info h2')?.innerText;
        const precoProduto = document.querySelector('.produto-info .preco')?.innerText;
        const imagemProduto = document.querySelector('.produto-imagem img')?.getAttribute('src');

        if (nomeProduto && precoProduto) {
            const novoItem = {
                nome: nomeProduto,
                preco: precoProduto,
                imagem: imagemProduto || ''
            };

            const itens = getCarrinho();
            itens.push(novoItem);
            salvarCarrinho(itens);
            
        }
    }

    const btnComprar = document.querySelector('button[data-bs-target="#modalCompra"]');
    
    if (btnComprar) {
        btnComprar.addEventListener('click', function() {
            adicionarItemAtual();
        });
    }

    atualizarInterface();
});