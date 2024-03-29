package virtual.instruction;

import errors.BadInstructionException;
import virtual.VirtualMachine;
import virtual.Warrior;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Classe abstraite pour représenter une instruction RedCode.
 * Une instance de la classe peut être clonée, donc la classe implémente Cloneable.
 * Nous avons décidé de représenter une instruction comme ceci:
 *
 * Modifieur A Adresse A Modifieur B Adresse B
 *
 * L'opérateur sera le nom de la classe.
 *
 * Pour les instructions à un seul champ, nous avons décidé de les coder
 * ainsi:
 *
 * Modifieur A Adresse A null null
 *
 * Il sera plus facile de découper cette instruction (dans le Parser)
 * et les attributs à null veulent bien dire qu'ils ne sont pas
 * initialisé du tout.
 */
public abstract class Instruction implements Cloneable{

    /**
     * Attribut statique Int2MF, pour "décoder" les modes d'adressages.
     */
    private static final HashMap<Integer, String> Int2MF=new HashMap<Integer, String>(){{

        put(0,"");
        put(1,"#");
        put(2,"@");

    }
    };

    /**
     * Attribut représentant le modifieur de l'adresse A. Nous codons les modifieurs comme des entiers:
     * 0 : adresse relative (par rapport à l'instruction)
     * 1 : adressage immédiat, donc un entier
     * 2 : adressage indirect, par rapport au champ A pointé par cette adresse
     * Dans le RedCode original, l'adresse indirect fait pointer sur le champ B. Mais nous avons fait le choix de modéliser les instructions à un champ comme étant OP A et non OP _ B. Pour coller à notre logique, nous avons donc décidé de changer l'effet de l'adressage indirect pour qu'il fonctionne en toute circonstance.
     */

    protected Integer modifierA;

    /**
     * Attribut représentant la valeur du champ A. En RedCode, tout les champs représentent des entiers, que ça soit une adresse mémoire ou l'entier lui même
     */

    protected Integer addressA;

    /**
     * Attribut représentant le modifieur de l'adresse B.
     */

    protected Integer modifierB;

    /**
     * Attribut représentant la valeur du champ B
     */

    protected Integer addressB;

    /**
     * Attribut représentant le warrior qui a exécuté (ou qui possède)
     * cette instruction.
     */

    protected Warrior lastAccessed;

    /**
     * Constructeur de copie
     * @param modifierA Le modifieur A
     * @param addressA Le champ A
     * @param modifierB Le modifieur B
     * @param addressB Le champ B
     * @param w Le dernier Warrior qui a accédé à cette instruction
     */
    public Instruction(Integer modifierA,Integer addressA,Integer modifierB,Integer addressB,Warrior w) {

        this.modifierA=modifierA;
        this.addressA=addressA;
        this.modifierB=modifierB;
        this.addressB=addressB;

        this.lastAccessed=w;


    }

    /**
     * Constructeur principal
     * @param field1 L'ArrayList qui code pour le premier champ
     * @param field2 L'ArrayList qui code pour le second champ
     */
    public Instruction(ArrayList<Integer> field1,ArrayList<Integer> field2){

        this(field1.get(0),field1.get(1),field2.get(0),field2.get(1),null);
    }

    public Integer getModifierA() {
        return modifierA;
    }

    public Integer getModifierB() {
        return modifierB;
    }

    public Warrior getLastAccessed() {
    	return this.lastAccessed;
    }

    public Integer getAddressA() {
        return addressA;
    }


    public Integer getAddressB() {
        return addressB;
    }


    public void setAddressA(int addressA) {
        this.addressA = addressA;
    }


    public void setAddressB(int addressB) {
        this.addressB = addressB;
    }

    public void setLastAccessed(Warrior w){
        this.lastAccessed=w;
    }

    /**
     * Méthode qui va permettre de convertir une adresse indirect en
     * une adresse relative.
     * @param destination L'adresse pointée par pointer
     * @param pointer Le pointeur à cet instant
     * @return La position du pointeur en prenant en compte l'adressage
     * indirect.
     */
    public int indirectToRelative(Instruction destination,int pointer){

        return Math.floorMod(pointer+destination.getAddressA(),VirtualMachine.TAILLE);

    }

    /**
     * Méthode permettant à l'instruction de s'exécuter. Dépends de l'instruction
     * @param pointer Le pointeur qui définit à quelle adresse nous sommes dans la mémoire
     * @param memory La machine virtuelle sur laquelle agir.
     * @param w Le Warrior qui exécute cette instruction
     * @return La nouvelle position du pointeur, selon l'instruction effectuée ou -1 en cas de pointeur mort.
     */
    public abstract int execution(int pointer, VirtualMachine memory,Warrior w);

    /**
     * Méthode permettant à une instruction de vérifier qu'elle est valide, c'est à dire que les modifieurs sont bons et en adéquation avec le comportement de l'instruction et son fonctionnement. Normalement elle pourrait être statique, car elle ne nécessite pas qu'une instance soit créé pour vérifier cela, mais comme cette méthode est spécifique à chaque instruction, on doit obligatoirement la garder abstraite.
     * @throws BadInstructionException Si l'instruction n'est pas exécutable
     */
    public abstract void isValidConfig() throws BadInstructionException;

    /**
     * Méthode qui permet de cloner une instruction, afin d'avoir deux instances différentes d'une instruction comportant le même opérateur et les mêmes champs.
     * @return Une nouvelle instance de la classe Instruction possèdant les mêmes attributs
     */
    @Override
    public abstract Instruction clone();

    @Override
    public String toString() {

        StringBuilder line=new StringBuilder();

        //Nom de classe en majuscule=opérateur
        String op=this.getClass().getSimpleName().toUpperCase();

        line.append(op).append(" ");

        //Le premier champ
        line.append(this.fieldToString(this.getModifierA(),this.getAddressA()));

        //Si il existe un second champ
        if(this.getModifierB()!=null){

            line.append(" ");
            line.append(this.fieldToString(this.getModifierB(),this.getAddressB()));

        }

        return line.toString();
        /*return "Instruction{" +
                "modifierA=" + modifierA +
                ", addressA=" + addressA +
                ", modifierB=" + modifierB +
                ", addressB=" + addressB +
                '}';*/
    }

    private String fieldToString(int mf,int adresse){

        StringBuilder field=new StringBuilder();

        String mode=Instruction.Int2MF.get(mf);

        return field.append(mode).append(adresse).toString();

    }
}

