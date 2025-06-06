document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const contentArea = document.getElementById('content-area');

    const content = {
        introduction: `
            <section>
                <h2>O Que é um Algoritmo?</h2>
                <p>Em programação, um <strong>algoritmo</strong> é uma sequência finita de instruções bem definidas e não ambíguas, que são executadas passo a passo para resolver um problema específico ou realizar uma tarefa.</p>
                <p>Pense em um algoritmo como uma receita de bolo: ela lista os ingredientes necessários (entrada), as instruções passo a passo para misturá-los e assar (processamento), e o bolo pronto (saída).</p>
                <h3>Por que Algoritmos são Importantes?</h3>
                <p>Algoritmos são a espinha dorsal de qualquer software. Eles fornecem a lógica que permite aos computadores realizar desde tarefas simples, como calcular a soma de dois números, até operações complexas, como:</p>
                <ul>
                    <li>Recomendar produtos em uma loja online.</li>
                    <li>Encontrar o caminho mais curto em um mapa.</li>
                    <li>Processar transações financeiras de forma segura.</li>
                    <li>Analisar grandes volumes de dados para extrair informações úteis.</li>
                </ul>
                <p>Sem um algoritmo claro e correto, um programa não funcionaria como esperado ou poderia produzir resultados incorretos. Portanto, o estudo e a criação de algoritmos eficientes são fundamentais na ciência da computação e no desenvolvimento de software.</p>
            </section>
        `,
        characteristics: `
            <section>
                <h2>Características Essenciais de um Algoritmo</h2>
                <p>Para ser considerado um algoritmo válido e eficaz, ele geralmente deve exibir as seguintes características:</p>
                <ul>
                    <li><strong>Entrada (Input):</strong> Um algoritmo pode ter zero ou mais entradas bem definidas. Estas são os dados ou informações com os quais o algoritmo trabalhará. Por exemplo, em um algoritmo de ordenação, a entrada seria a lista de números a ser ordenada.</li>
                    <li><strong>Saída (Output):</strong> Um algoritmo deve ter uma ou mais saídas bem definidas. Estas são os resultados produzidos pelo algoritmo após o processamento das entradas. A saída deve ter uma relação clara com a entrada e o objetivo do algoritmo.</li>
                    <li><strong>Não Ambíguo (Unambiguous):</strong> Cada passo ou instrução em um algoritmo deve ser claro, preciso e sem ambiguidades. Deve haver apenas uma interpretação possível para cada instrução.</li>
                    <li><strong>Finitude (Finiteness):</strong> Um algoritmo deve terminar após um número finito de passos. Ele não pode entrar em um loop infinito ou continuar indefinidamente.</li>
                    <li><strong>Eficácia/Efetividade (Effectiveness):</strong> Cada instrução de um algoritmo deve ser básica o suficiente para ser executada, em princípio, por uma pessoa usando apenas papel e caneta. Além disso, as instruções devem ser factíveis e contribuir para o resultado final.</li>
                    <li><strong>Independência da Linguagem de Programação:</strong> Um algoritmo é uma descrição lógica da solução e pode ser implementado em qualquer linguagem de programação. A lógica permanece a mesma, independentemente da sintaxe da linguagem.</li>
                    <li><strong>Correto (Correctness):</strong> Um algoritmo é correto se, para cada conjunto de entradas válidas, ele produz a saída correta e para de executar.</li>
                </ul>
                <p>Compreender e garantir essas características ao projetar algoritmos é crucial para desenvolver software confiável e eficiente.</p>
            </section>
        `,
        example: `
            <section>
                <h2>Exemplo Prático de um Algoritmo: Fazer Chá</h2>
                <p>Um algoritmo não precisa ser complexo ou relacionado a computadores. Muitas de nossas rotinas diárias podem ser descritas como algoritmos. Vejamos um exemplo simples: o algoritmo para fazer uma xícara de chá.</p>

                <p><strong>Objetivo:</strong> Preparar uma xícara de chá.</p>

                <p><strong>Entradas (Ingredientes/Materiais):</strong></p>
                <ul>
                    <li>Saquinho de chá</li>
                    <li>Água</li>
                    <li>Chaleira</li>
                    <li>Xícara</li>
                    <li>Açúcar/Adoçante (opcional)</li>
                    <li>Leite (opcional)</li>
                </ul>

                <p><strong>Passos (Instruções):</strong></p>
                <ol>
                    <li>Encher a chaleira com água.</li>
                    <li>Ligar a chaleira e aquecer a água até ferver.</li>
                    <li>Colocar o saquinho de chá na xícara.</li>
                    <li>Quando a água ferver, desligar a chaleira.</li>
                    <li>Despejar a água fervente na xícara sobre o saquinho de chá.</li>
                    <li>Esperar alguns minutos para o chá infundir (e.g., 3-5 minutos, dependendo da preferência).</li>
                    <li>Retirar o saquinho de chá da xícara.</li>
                    <li>Se desejar, adicionar açúcar/adoçante e/ou leite.</li>
                    <li>Mexer o chá.</li>
                </ol>

                <p><strong>Saída:</strong> Uma xícara de chá pronta para beber.</p>

                <p>Este exemplo simples ilustra todas as características de um algoritmo:</p>
                <ul>
                    <li>Tem <strong>entradas</strong> (água, saquinho de chá, etc.).</li>
                    <li>Produz uma <strong>saída</strong> (chá pronto).</li>
                    <li>Cada passo é <strong>não ambíguo</strong> (e.g., "encher a chaleira com água" é uma instrução clara).</li>
                    <li>É <strong>finito</strong> (termina quando o chá está pronto).</li>
                    <li>É <strong>eficaz</strong> (cada passo é realizável).</li>
                </ul>
                <p>Da mesma forma, algoritmos em programação detalham os passos que um computador deve seguir para transformar entradas em saídas desejadas, resolvendo problemas de forma estruturada.</p>
            </section>
        `
    };

    function setActiveLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Load initial content (Introduction) and set active link
    contentArea.innerHTML = content.introduction;
    const initialActiveLink = document.querySelector('nav a[data-content="introduction"]');
    if (initialActiveLink) {
        setActiveLink(initialActiveLink);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const contentKey = link.getAttribute('data-content');
            if (content[contentKey]) {
                contentArea.innerHTML = content[contentKey];
                setActiveLink(link);
            } else {
                contentArea.innerHTML = '<p>Conteúdo não encontrado.</p>';
            }
        });
    });
});
