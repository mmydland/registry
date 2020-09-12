for f in "$@"
do
    if [[ $f == *"dtmi/"* ]]
    then
        dtdl2-validator $f local
    fi
done