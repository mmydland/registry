for f in "$@"
do
    if [[ $f == *"models/"* ]]
    then
        dtdl2-validator $f local
    fi
done