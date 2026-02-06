// get id from URL
const params = new URLSearchParams(window.location.search);
const objectId = params.get("id");

// load JSON file
fetch("objects.json")
  .then(response => response.json())
  .then(data => {

    const obj = data.objects.find(o => o.id === objectId);

    if (!obj) {
      document.body.innerText = "Object not found";
      return;
    }

    document.getElementById("name").innerText = obj.name;
    document.getElementById("desc").innerText = obj.description;

    // talking
    const speech = new SpeechSynthesisUtterance(obj.description);
    speechSynthesis.speak(speech);
  });
