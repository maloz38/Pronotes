def saisirNotes():
    while True:
        nom = input("Prénom (ou rien écrire) : ")
        if nom == "":
            print("fin saisie")
            break
        note = input("Note sur 20 : ")

        with open("notes.txt", "a", encoding="utf-8") as f:
            f.write(f"{nom},{note}\n")

def lireNotes():
    try:
        with open("notes.txt", "r", encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        print("Fichier non trouvé.")
        return

    somme = 0
    nombre = 0
    for line in lines:
        parts = line.strip().split(",")
        if len(parts) == 2:
            somme += float(parts[1])
            nombre += 1

    if nombre > 0:
        print(f"La moyenne des notes est : {somme / nombre}")
    else:
        print("Pas de notes.")

def changerNotes(nom, nouvelle_note):
    try:
        with open("notes.txt", "r", encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        print("Fichier non trouvé.")
        return

    trouve = False
    nouvelles_lignes = []

    for line in lines:
        parts = line.strip().split(",")
        if len(parts) == 2 and parts[0] == nom:
            nouvelles_lignes.append(f"{nom},{nouvelle_note}\n")
            trouve = True
        else:
            nouvelles_lignes.append(line)

    if trouve:
        with open("notes.txt", "w", encoding="utf-8") as f:
            f.writelines(nouvelles_lignes)
    else:
        print(f"{nom} n'est pas dans ce fichier")

if __name__ == "__main__":
    print("Ce fichier contient les fonctions du TP.")
    print("Pour l'utiliser, importez-le ou exécutez les fonctions dans la console :")
    print("  saisirNotes()")
    print("  lireNotes()")
    print("  changerNotes('Nom', note)")
