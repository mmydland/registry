for f in "$@"
do
    if [[ $f == *"dtmi/"* ]]
    then
        dtdl2-validator /f=$f /resolver=local
    fi
done
