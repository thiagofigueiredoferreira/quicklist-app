
    // 1. Estado da aplicação: Lista pré-cadastrada idêntica ao design da imagem
    let shoppingList = [
      { id: 1, name: "Pão de forma", completed: false },
      { id: 2, name: "Café preto", completed: false },
      { id: 3, name: "Suco de laranja", completed: false },
      { id: 4, name: "Bolacha", completed: false }
    ];

    // Variável para controle do tempo de exibição do alerta
    let toastTimeout = null;

    // 2. Elementos da interface mapeados
    const itemForm = document.getElementById("item-form");
    const itemInput = document.getElementById("item-input");
    const itemsListContainer = document.getElementById("items-list");
    const emptyState = document.getElementById("empty-state");
    const toastAlert = document.getElementById("toast-alert");
    const toastCloseBtn = document.getElementById("toast-close");

    // 3. Função de renderização completa da lista
    function renderList() {
      // Limpar o container da lista
      itemsListContainer.innerHTML = "";

      // Exibir aviso se não houver itens
      if (shoppingList.length === 0) {
        emptyState.style.display = "block";
        return;
      } else {
        emptyState.style.display = "none";
      }

      // Criar cada item no DOM
      shoppingList.forEach((item) => {
        const li = document.createElement("li");
        li.className = `item-card ${item.completed ? "completed" : ""}`;
        li.setAttribute("data-id", item.id);

        li.innerHTML = `
          <div class="item-left" onclick="toggleItem(${item.id})">
            <div class="custom-checkbox" aria-checked="${item.completed}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="item-name">${escapeHTML(item.name)}</span>
          </div>

          <button 
            type="button" 
            class="btn-delete" 
            onclick="removeItem(${item.id})" 
            title="Remover item"
            aria-label="Remover ${escapeHTML(item.name)}"
          >
            <!-- Ícone de Lixeira idêntico ao modelo -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        `;

        itemsListContainer.appendChild(li);
      });
    }

    // 4. Adicionar novo item
    itemForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      const text = itemInput.value.trim();

      // Bloquear se o input estiver em branco
      if (!text) {
        itemInput.focus();
        return;
      }

      // Adicionar novo item com ID único
      const newItem = {
        id: Date.now(),
        name: text,
        completed: false
      };

      shoppingList.push(newItem);
      renderList();

      // Limpar o campo e devolver o foco
      itemInput.value = "";
      itemInput.focus();
    });

    // 5. Alternar status do item (Concluído / Pendente)
    function toggleItem(id) {
      shoppingList = shoppingList.map(item => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      renderList();
    }

    // 6. Remover item e disparar o alerta inferior
    function removeItem(id) {
      shoppingList = shoppingList.filter(item => item.id !== id);
      renderList();
      showToastAlert();
    }

    // 7. Controle do Toast / Banner de remoção
    function showToastAlert() {
      // Se houver um temporizador ativo, resetar
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      toastAlert.classList.add("show");

      // Ocultar automaticamente após 3 segundos
      toastTimeout = setTimeout(() => {
        hideToastAlert();
      }, 3000);
    }

    function hideToastAlert() {
      toastAlert.classList.remove("show");
      if (toastTimeout) {
        clearTimeout(toastTimeout);
        toastTimeout = null;
      }
    }

    toastCloseBtn.addEventListener("click", hideToastAlert);

    // 8. Botão "Voltar"
    function handleGoBack() {
      if (window.history.length > 1) {
        window.history.back();
      }
    }

    // Função utilitária para segurança contra injeção de HTML
    function escapeHTML(str) {
      const p = document.createElement("p");
      p.textContent = str;
      return p.innerHTML;
    }

    // Inicialização ao carregar a página
    window.onload = function() {
      renderList();
    };