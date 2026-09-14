from django.shortcuts import render


def transferencia(request):
    metodo = request.method
    dato = request.GET.get("dato") if metodo == "GET" else request.POST.get("dato")
    resultado = ""

    if dato:
        resultado = f"El dato llegó mediante {metodo}: {dato}"

    return render(
        request,
        "index.html",
        {
            "resultado": resultado,
            "dato": dato or "",
            "metodo": metodo,
        },
    )