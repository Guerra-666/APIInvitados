class Proceso:
    def __init__(self, id, tiempo_llegada, tiempo_ejecucion):
        self.id = id
        self.tiempo_llegada = tiempo_llegada
        self.tiempo_ejecucion = tiempo_ejecucion
        self.tiempo_restante = tiempo_ejecucion
        self.tiempo_inicio = None
        self.tiempo_finalizacion = None
        self.tiempo_espera = 0
        self.tiempo_retorno = 0

def obtener_entero_positivo(mensaje):
    while True:
        try:
            valor = int(input(mensaje))
            if valor < 0:
                print("El valor debe ser un número entero no negativo.")
            else:
                return valor
        except ValueError:
            print("Entrada inválida. Introduce un número entero.")

def mostrar_tabla(procesos):
    print("\nTabla de procesos:")
    print("ID | Llegada | Ejecución | Inicio | Fin | Espera | Retorno")
    for p in procesos:
        print(f"{p.id:2} | {p.tiempo_llegada:7} | {p.tiempo_ejecucion:9} | {p.tiempo_inicio:6} | {p.tiempo_finalizacion:3} | {p.tiempo_espera:6} | {p.tiempo_retorno:7}")

def fifo_scheduling(procesos):
    procesos_ordenados = sorted(procesos, key=lambda x: (x.tiempo_llegada, x.id))
    tiempo_actual = 0
    
    for proceso in procesos_ordenados:
        tiempo_inicio = max(tiempo_actual, proceso.tiempo_llegada)
        proceso.tiempo_inicio = tiempo_inicio
        proceso.tiempo_finalizacion = tiempo_inicio + proceso.tiempo_ejecucion
        proceso.tiempo_espera = tiempo_inicio - proceso.tiempo_llegada
        proceso.tiempo_retorno = proceso.tiempo_finalizacion - proceso.tiempo_llegada
        tiempo_actual = proceso.tiempo_finalizacion
        
        print(f"Proceso {proceso.id} ejecutado de {tiempo_inicio} a {proceso.tiempo_finalizacion}")

    total_espera = sum(p.tiempo_espera for p in procesos_ordenados)
    total_retorno = sum(p.tiempo_retorno for p in procesos_ordenados)
    
    print("\nResumen FIFO:")
    print(f"Tiempo total de ejecución: {tiempo_actual}")
    print(f"Tiempo promedio de espera: {total_espera / len(procesos):.2f}")
    print(f"Tiempo promedio de retorno: {total_retorno / len(procesos):.2f}")
    mostrar_tabla(procesos_ordenados)

def sjf_scheduling(procesos):
    procesos_ordenados = sorted(procesos, key=lambda x: (x.tiempo_llegada, x.tiempo_ejecucion, x.id))
    tiempo_actual = 0
    procesos_ejecutados = []
    cola = []
    indice = 0

    while len(procesos_ejecutados) < len(procesos_ordenados):
        while indice < len(procesos_ordenados) and procesos_ordenados[indice].tiempo_llegada <= tiempo_actual:
            cola.append(procesos_ordenados[indice])
            indice += 1

        if not cola:
            if indice < len(procesos_ordenados):
                tiempo_actual = procesos_ordenados[indice].tiempo_llegada
            continue

        cola_ordenada = sorted(cola, key=lambda x: (x.tiempo_ejecucion, x.tiempo_llegada, x.id))
        proceso_actual = cola_ordenada[0]
        cola.remove(proceso_actual)

        proceso_actual.tiempo_inicio = tiempo_actual
        proceso_actual.tiempo_finalizacion = tiempo_actual + proceso_actual.tiempo_ejecucion
        proceso_actual.tiempo_espera = proceso_actual.tiempo_inicio - proceso_actual.tiempo_llegada
        proceso_actual.tiempo_retorno = proceso_actual.tiempo_finalizacion - proceso_actual.tiempo_llegada
        tiempo_actual = proceso_actual.tiempo_finalizacion
        procesos_ejecutados.append(proceso_actual)

        print(f"Proceso {proceso_actual.id} ejecutado de {proceso_actual.tiempo_inicio} a {proceso_actual.tiempo_finalizacion}")

    total_espera = sum(p.tiempo_espera for p in procesos_ordenados)
    total_retorno = sum(p.tiempo_retorno for p in procesos_ordenados)
    
    print("\nResumen SJF:")
    print(f"Tiempo total de ejecución: {tiempo_actual}")
    print(f"Tiempo promedio de espera: {total_espera / len(procesos):.2f}")
    print(f"Tiempo promedio de retorno: {total_retorno / len(procesos):.2f}")
    mostrar_tabla(procesos_ordenados)

def rr_scheduling(procesos, quantum):
    procesos_ordenados = sorted(procesos, key=lambda x: (x.tiempo_llegada, x.id))
    cola = []
    tiempo_actual = 0
    indice = 0

    for p in procesos_ordenados:
        p.tiempo_restante = p.tiempo_ejecucion
        p.tiempo_inicio = None

    while True:
        while indice < len(procesos_ordenados) and procesos_ordenados[indice].tiempo_llegada <= tiempo_actual:
            cola.append(procesos_ordenados[indice])
            indice += 1

        if not cola:
            if indice < len(procesos_ordenados):
                tiempo_actual = procesos_ordenados[indice].tiempo_llegada
                continue
            else:
                break

        proceso_actual = cola.pop(0)
        if proceso_actual.tiempo_inicio is None:
            proceso_actual.tiempo_inicio = tiempo_actual

        tiempo_ejecucion = min(quantum, proceso_actual.tiempo_restante)
        proceso_actual.tiempo_restante -= tiempo_ejecucion
        print(f"Proceso {proceso_actual.id} ejecutado por {tiempo_ejecucion} unidades (de {tiempo_actual} a {tiempo_actual + tiempo_ejecucion})")
        tiempo_actual += tiempo_ejecucion

        while indice < len(procesos_ordenados) and procesos_ordenados[indice].tiempo_llegada <= tiempo_actual:
            cola.append(procesos_ordenados[indice])
            indice += 1

        if proceso_actual.tiempo_restante > 0:
            cola.append(proceso_actual)
        else:
            proceso_actual.tiempo_finalizacion = tiempo_actual
            proceso_actual.tiempo_retorno = proceso_actual.tiempo_finalizacion - proceso_actual.tiempo_llegada
            proceso_actual.tiempo_espera = proceso_actual.tiempo_retorno - proceso_actual.tiempo_ejecucion

    total_espera = sum(p.tiempo_espera for p in procesos_ordenados)
    total_retorno = sum(p.tiempo_retorno for p in procesos_ordenados)
    
    print("\nResumen Round Robin:")
    print(f"Tiempo total de ejecución: {tiempo_actual}")
    print(f"Tiempo promedio de espera: {total_espera / len(procesos):.2f}")
    print(f"Tiempo promedio de retorno: {total_retorno / len(procesos):.2f}")
    mostrar_tabla(procesos_ordenados)

def reset_procesos(procesos):
    for p in procesos:
        p.tiempo_inicio = None
        p.tiempo_finalizacion = None
        p.tiempo_espera = 0
        p.tiempo_retorno = 0
        p.tiempo_restante = p.tiempo_ejecucion

if __name__ == "__main__":
    procesos = []
    n = obtener_entero_positivo("Introduce el número de procesos: ")

    for i in range(n):
        print(f"\nProceso {i+1}:")
        id_proceso = obtener_entero_positivo("  ID del proceso: ")
        tiempo_llegada = obtener_entero_positivo("  Tiempo de llegada: ")
        tiempo_ejecucion = obtener_entero_positivo("  Tiempo de ejecución: ")
        procesos.append(Proceso(id_proceso, tiempo_llegada, tiempo_ejecucion))

    while True:
        print("\nOpciones de planificación:")
        print("1. FIFO (First In, First Out)")
        print("2. SJF (Shortest Job First)")
        print("3. Round Robin")
        print("4. Salir")
        opcion = input("Selecciona una opción: ")

        if opcion == '1':
            reset_procesos(procesos)
            fifo_scheduling(procesos)
        elif opcion == '2':
            reset_procesos(procesos)
            sjf_scheduling(procesos)
        elif opcion == '3':
            reset_procesos(procesos)
            quantum = obtener_entero_positivo("Introduce el quantum para Round Robin: ")
            rr_scheduling(procesos, quantum)
        elif opcion == '4':
            print("Saliendo del programa...")
            break
        else:
            print("Opción inválida. Intenta de nuevo.")