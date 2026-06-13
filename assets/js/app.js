const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const data = ref(portfolioData);
    const activeTab = ref('about');
    const activeCategory = ref('All');
    const isSidebarActive = ref(false);
    const activeModalPost = ref(null);

    // ── Typewriter role cycling ──────────────────────────────
    const roles = data.value.profile.role.split(' | ').map(r => r.trim());
    const displayRole = ref(roles[0]);
    let roleIndex = 0, charIndex = roles[0].length, isDeleting = false;

    function typeStep() {
      const current = roles[roleIndex];
      if (!isDeleting) {
        charIndex++;
        displayRole.value = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeStep, 2000);
          return;
        }
        setTimeout(typeStep, 75);
      } else {
        charIndex--;
        displayRole.value = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeStep, 300);
          return;
        }
        setTimeout(typeStep, 40);
      }
    }

    // ── Contact helpers ────────────────────────────────────────
    const socialNames = {
      'logo-whatsapp':  'WhatsApp',
      'logo-discord':   'Discord',
      'logo-instagram': 'Instagram',
      'logo-twitter':   'Twitter / X',
      'logo-linkedin':  'LinkedIn',
      'logo-github':    'GitHub',
      'logo-youtube':   'YouTube',
      'logo-tiktok':    'TikTok',
    };

    const getSocialName = (icon) => socialNames[icon] || icon.replace('logo-', '');

    const getSocialHandle = (url) => {
      try {
        const path = new URL(url).pathname.replace(/\/+$/, '');
        const parts = path.split('/').filter(Boolean);
        return parts[parts.length - 1] ? '@' + parts[parts.length - 1] : url;
      } catch {
        return url;
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
      getSocialName,
      getSocialHandle,
      displayRole
    };
  }
}).mount('#app');
