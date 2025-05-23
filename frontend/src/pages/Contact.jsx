import ContactForm from "../components/Contact/Form";

function Contact() {
  return (
    <section class="my-[80px] flex flex-col items-center justify-center text-center">
      <div class="mb-10 max-w-4xl md:mb-20">
        <h2 class="mx-5 text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
          Votre avis compte !
        </h2>
        <p class="mx-8 my-8 text-sm font-normal sm:text-base md:mx-4 md:text-lg lg:mx-0">
          Votre retour est essentiel pour nous améliorer ! Partagez votre
          expérience, dites-nous ce que vous aimez et ce que nous pourrions
          améliorer. Vos suggestions nous aident à faire de ce blog une
          ressource toujours plus utile et enrichissante.
        </p>
      </div>

      <ContactForm />
    </section>
  );
}

export default Contact;
