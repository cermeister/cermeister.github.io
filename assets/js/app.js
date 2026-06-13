const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const data = ref(portfolioData);
    const activeTab = ref('blog');
    const activeCategory = ref('All');
    const isSidebarActive = ref(false);
    const activeModalPost = ref(null);

    // ── Netlify Contact Form ───────────────────────────────────────
    const contactForm = ref({ fullname: '', email: '', message: '' });
    const formStatus = ref('idle'); // 'idle' | 'sending' | 'success' | 'error'

    const encode = (data) =>
      Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

    const submitForm = async () => {
      formStatus.value = 'sending';
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            'form-name': 'contact',
            fullname: contactForm.value.fullname,
            email: contactForm.value.email,
            message: contactForm.value.message
          })
        });
        if (res.ok) {
          formStatus.value = 'success';
          contactForm.value = { fullname: '', email: '', message: '' };
        } else {
          formStatus.value = 'error';
        }
      } catch (_) {
        formStatus.value = 'error';
      }
    };

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
      closeModal,
      contactForm,
      formStatus,
      submitForm
    };
  }
}).mount('#app');
