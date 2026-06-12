const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const data = ref(portfolioData);
    const activeTab = ref('blog');
    const activeCategory = ref('All');
    const isSidebarActive = ref(false);
    const activeModalPost = ref(null);

    // Filter portfolio projects based on active category
    const filteredProjects = computed(() => {
      if (activeCategory.value === 'All') {
        return data.value.portfolio.projects;
      }
      return data.value.portfolio.projects.filter(
        project => project.category === activeCategory.value
      );
    });

    const setTab = (tab) => {
      activeTab.value = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const setCategory = (category) => {
      activeCategory.value = category;
    };

    const toggleSidebar = () => {
      isSidebarActive.value = !isSidebarActive.value;
    };

    const openModal = (post) => {
      activeModalPost.value = post;
    };

    const closeModal = () => {
      activeModalPost.value = null;
    };

    return {
      data,
      activeTab,
      activeCategory,
      filteredProjects,
      setTab,
      setCategory,
      toggleSidebar,
      isSidebarActive,
      activeModalPost,
      openModal,
      closeModal
    };
  }
}).mount('#app');
