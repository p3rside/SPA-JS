async function loadImageAsBlob(url, imgElement) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    imgElement.src = objectURL;
  } catch (err) {
    console.error("Błąd ładowania obrazu:", err);
  }
}

const setupLazyLoading = () => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImageAsBlob(img.dataset.src, img); 
        observer.unobserve(img); 
      }
    });
  });

  document.querySelectorAll('.lazy-blob').forEach(img => observer.observe(img));
};